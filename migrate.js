const {MongoClient} = require('mongodb');

async function listDatabases(client){
    databasesList = await client.db("tutorQueue").listCollections().toArray();
    console.log(databasesList)
};

async function getItems(client, collectionName){
    const items = await client.db("tutorQueue").collection(collectionName).find({}).toArray();
    return items;
}

async function main(){
    /**
     * Connection URI. Update <username>, <password>, and <your-cluster-url> to reflect your cluster.
     * See https://docs.mongodb.com/ecosystem/drivers/node/ for more details
     */
    const fromUri = "mongodb+srv://tutorcoords:beardowntutorup@cluster0.qs95z.mongodb.net/tutorQueue?retryWrites=true&w=majority";

    const fromClient = new MongoClient(fromUri);

    const toUri = "mongodb+srv://admin:test123@dev.vbai1.mongodb.net/dev?retryWrites=true&w=majority";
    const toClient = new MongoClient(toUri);

    try {
        // Connect to the MongoDB cluster
        await fromClient.connect();

        await toClient.connect();

        await listDatabases(fromClient)

        // Make the appropriate DB calls
        const pre = await getItems(fromClient, "tutors");
        const courses = [...new Set(pre.map(e=>e.courses).flat())].map(e=>e.replace(" ", ''));
        for(let course of courses){
            const res = await toClient.db('dev').collection('tutor_center_course').replaceOne(
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

        const courseObjs = await toClient.db('dev').collection('tutor_center_course').find(
            {
                code: {
                    $in: courses
                }
            }
        ).toArray();

        let courseTutorMax = await toClient.db('dev').collection('tutor_center_tutor_courses').find().sort({id:-1}).limit(1).toArray();
        let courseTutorId = courseTutorMax[0].id

        for(let tutor of pre){
            const res = await toClient.db('dev').collection('tutor_center_tutor').updateOne(
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
                        is_coord: tutor.isCoord
                    }
                },
                {
                    upsert: true
                }
            );
            const tutorObj = await toClient.db('dev').collection('tutor_center_tutor').findOne(
                {
                    email: tutor.email
                }
            );
            for(let course of tutor.courses.map(e=>e.replace(" ", ''))){
                const courseRes = await toClient.db('dev').collection('tutor_center_tutor_courses').updateOne(
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

        const migratedTutors = await toClient.db('dev').collection('tutor_center_tutor').find(
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
        for(let request of await getItems(fromClient, "tutorrequests")){
            const course = courseObjs.find(e=>e.code === request.course.replace(" ", ''));
            if(course){
                const reqRes = await toClient.db('dev').collection('tutor_center_tutoringrequest').insertOne(
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
