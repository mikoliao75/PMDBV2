
// Import necessary Firebase and data modules
import { db } from "../firebase/config"; // Adjust the path based on your project structure
import { collection, addDoc, setDoc, doc } from "firebase/firestore";
import { mockUsers, mockProjects, mockSchedules, mockAssignments } from "./data"; // Your mock data

const seedCollection = async (collectionName: string, data: any[]) => {
  console.log(`Starting to seed ${collectionName}...`);
  const collectionRef = collection(db, collectionName);
  let count = 0;

  for (const item of data) {
    try {
      // If the item has a specific ID, use it. Otherwise, let Firestore generate one.
      if (item.id) {
        await setDoc(doc(db, collectionName, item.id), item);
      } else {
        await addDoc(collectionRef, item);
      }
      count++;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}: `, error);
    }
  }

  console.log(`Seeded ${count} documents into ${collectionName}.`);
};

const seedDatabase = async () => {
  console.log("Starting database seeding process...");

  // Seed all collections
  await seedCollection("users", mockUsers);
  await seedCollection("projects", mockProjects);
  await seedCollection("schedules", mockSchedules);
  await seedCollection("assignments", mockAssignments);

  console.log("Database seeding completed successfully!");
};

seedDatabase().catch((error) => {
  console.error("An error occurred during the database seeding process:", error);
});
