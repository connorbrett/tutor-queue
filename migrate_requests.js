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

        const courseObjs = await getItems(toClient, TO_DB, 'tutor_center_course')
        const pre = await getItems(fromClient, FROM_DB, 'tutors');
        const migratedTutors = await getItems(toClient, TO_DB, 'tutor_center_tutor')
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
