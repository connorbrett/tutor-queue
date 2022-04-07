const {MongoClient} = require('mongodb');

// Set these to the appropriate variables.
const fromDbUsername = process.env.FROM_DB_USERNAME;
const fromDbPassword = process.env.FROM_DB_PASSWORD;
const toDbUsername = process.env.TO_DB_USERNAME;
const toDbPassword = process.env.TO_DB_PASSWORD;

const FROM_DB = 'tutorQueue';
const TO_DB = 'tutorCenter';
const fromUri = `mongodb+srv://${fromDbUsername}:${fromDbPassword}@cluster0.qs95z.mongodb.net/?retryWrites=true&w=majority`;
const toUri = `mongodb+srv://${toDbUsername}:${toDbPassword}@cluster0.qs95z.mongodb.net/?retryWrites=true&w=majority`;

async function getItems(client, dbName, collectionName){
    const items = await client.db(dbName).collection(collectionName).find({}).toArray();
    return items;
}

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */

    const fromClient = new MongoClient(fromUri);

    const toClient = new MongoClient(toUri);

    try {
        // Connect to the MongoDB cluster
        await fromClient.connect();

        await toClient.connect();

        // Make the appropriate DB calls
        const pre = await getItems(fromClient, FROM_DB, "tutors");
        const courses = [...new Set(pre.map(e=>e.courses).flat())].map(e=>e.replace(" ", ''));
        for(let course of courses){
            const res = await toClient.db(TO_DB).collection('tutor_center_course').replaceOne(
                {
                    code: course
                },
                {
                    name: course,
                    code: course,
                    created_time: new Date(),
                    modified_time: new Date()
                },
                {
                    upsert: true
                }
            );
        }

        const courseObjs = await toClient.db(TO_DB).collection('tutor_center_course').find(
            {
                code: {
                    $in: courses
                }
            }
        ).toArray();

        let courseTutorMax = await toClient.db(TO_DB).collection('tutor_center_tutor_courses').find().sort({id:-1}).limit(1).toArray();
        let courseTutorId = courseTutorMax.length ? courseTutorMax[0].id : 0

        for(let tutor of pre){
            const res = await toClient.db(TO_DB).collection('tutor_center_tutor').updateOne(
                {
                    email: tutor.email
                },
                {
                    $set: {
                        name: tutor.name,
                        email: tutor.email,
                        created_time: new Date(),
                        modified_time: new Date(),
                        is_active: true,
                        last_login: null,
                        is_coord: tutor.isCoord,
                        password: ''
                    }
                },
                {
                    upsert: true
                }
            );
            const tutorObj = await toClient.db(TO_DB).collection('tutor_center_tutor').findOne(
                {
                    email: tutor.email
                }
            );
            for(let course of tutor.courses.map(e=>e.replace(" ", ''))){
                const courseRes = await toClient.db(TO_DB).collection('tutor_center_tutor_courses').updateOne(
                    {
                        tutor_id: tutorObj._id,
                        course_id: courseObjs.filter(e=>e.code===course)[0]._id,
                    },
                    {
                        $set:{
                            tutor_id: tutorObj._id,
                            course_id: courseObjs.filter(e=>e.code===course)[0]._id,
                            id:courseTutorId
                        }
                    },
                    {
                        upsert: true
                    }
                );
                courseTutorId += 1
            }
        }

        const migratedTutors = await toClient.db(TO_DB).collection('tutor_center_tutor').find(
            {
                email: {
                    $in: pre.map(e=>e.email)
                }
            }
        ).toArray();
        const idMap = {};
        for(let tutor of pre){
            idMap[tutor._id] = migratedTutors.find(e=>e.email === tutor.email)._id
        }
        console.log(idMap);
        for(let request of await getItems(fromClient, FROM_DB, "tutorrequests")){
            const course = courseObjs.find(e=>e.code === request.course.replace(" ", ''));
            if(course){
                const reqRes = await toClient.db(TO_DB).collection('tutor_center_tutoringrequest').insertOne(
                    {
                        name: request.name,
                        email: request.email,
                        status: request.status,
                        created_time: request.submitted,
                        modified_time: new Date(),
                        description: request.description,
                        closed_time: request.submitted,
                        requested_course_id: course._id,
                        tutor_id: idMap[request.tutor]
                    }
                );
            }
        }
    } catch (e) {
        console.error(e);
    } finally {
        await fromClient.close();
        await toClient.close();
    }
}

main().catch(console.error);
