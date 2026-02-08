
// Import the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc, getDocs, writeBatch } = require("firebase/firestore");

// Your web app's Firebase configuration
// IMPORTANT: Replace with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyCt0yH4CxjNGSAwZo9EGyRicrQWN2V4_TI",
    authDomain: "pm-dashboard-personal-20-ea9df.firebaseapp.com",
    projectId: "pm-dashboard-personal-20-ea9df",
    storageBucket: "pm-dashboard-personal-20-ea9df.firebasestorage.app",
    messagingSenderId: "343902118337",
    appId: "1:343902118337:web:6bb14830304264ceaf0f40",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function clearCollection(collectionName) {
    const collectionRef = collection(db, collectionName);
    const snapshot = await getDocs(collectionRef);
    if (snapshot.empty) {
        console.log(`${collectionName} collection is already empty.`);
        return;
    }
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
    });
    await batch.commit();
    console.log(`${collectionName} collection has been cleared.`);
}

async function seedDatabase() {
  try {
    console.log("Starting to clear existing data...");
    await clearCollection('users');
    await clearCollection('projects');
    await clearCollection('schedules');
    await clearCollection('assignments');
    console.log("All collections cleared.");

    console.log('Seeding database...');

    // 1. Create the initial Manager user
    const manager = {
        name: '林雅婷 (Manager)',
        email: 'manager@example.com',
        role: 'Manager',
        avatarUrl: 'https://i.pravatar.cc/150?u=manager',
        createdAt: new Date(),
    };
    const managerRef = await addDoc(collection(db, "users"), manager);
    console.log('Manager user created with ID: ', managerRef.id);

    // 2. Create other initial data (optional, but good for testing)
    const users = [
        { name: '陳翰霖', email: 'hanlin@example.com', role: 'Member', avatarUrl: 'https://i.pravatar.cc/150?u=user1', createdAt: new Date() },
        { name: '黃曉梅', email: 'xiaomei@example.com', role: 'Member', avatarUrl: 'https://i.pravatar.cc/150?u=user2', createdAt: new Date() },
        { name: '吳宗憲', email: 'zongxian@example.com', role: 'Member', avatarUrl: 'https://i.pravatar.cc/150?u=user3', createdAt: new Date() },
        { name: '周子瑜', email: 'tzuyu@example.com', role: 'Member', avatarUrl: 'https://i.pravatar.cc/150?u=user4', createdAt: new Date() },
    ];
    const userRefs = [];
    for (const user of users) {
        const userRef = await addDoc(collection(db, "users"), user);
        userRefs.push(userRef);
    }
    console.log(`${users.length} member users created.`);

    const projects = [
        { name: '專案A', description: '這是專案A的描述', status: '進行中', assigneeId: userRefs[0].id, isBossOrder: true, progress: 75, createdAt: new Date() },
        { name: '專案B', description: '這是專案B的描述', status: '已完成', assigneeId: userRefs[1].id, isBossOrder: false, progress: 100, createdAt: new Date() },
        { name: '專案C', description: '這是專案C的描述', status: '有風險', assigneeId: userRefs[0].id, isBossOrder: false, progress: 30, createdAt: new Date() },
        { name: '專案D', description: '這是專案D的描述', status: '已延遲', assigneeId: userRefs[2].id, isBossOrder: true, progress: 50, createdAt: new Date() },
    ];

    for (const project of projects) {
        await addDoc(collection(db, "projects"), project);
    }
    console.log(`${projects.length} projects created.`);

    const schedules = [
        { title: '團隊會議', date: '2024-08-01T10:00:00', type: '會議' },
        { title: '專案A截止日', date: '2024-08-15T17:00:00', type: '截止日' },
    ];

    for (const schedule of schedules) {
        await addDoc(collection(db, "schedules"), schedule);
    }
    console.log(`${schedules.length} schedule events created.`);

    const assignments = [
        { taskId: 'TASK-001', taskName: '完成專案A的UI設計', assigneeId: userRefs[0].id, dueDate: '2024-08-10' },
        { taskId: 'TASK-002', taskName: '開發專案C的後端API', assigneeId: userRefs[2].id, dueDate: '2024-08-20' },
    ];

    for (const assignment of assignments) {
        await addDoc(collection(db, "assignments"), assignment);
    }
    console.log(`${assignments.length} assignments created.`);


    console.log('Database seeding complete!');

  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

seedDatabase().then(() => {
    console.log("Script finished.");
    // The script will hang, this is expected for simple Node scripts with Firebase.
    // Manually exit with Ctrl+C after you see the completion message.
    process.exit(0);
});
