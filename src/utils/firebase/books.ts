import { 
    collection,
    addDoc, 
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    query,
    where, 
    orderBy,
    onSnapshot,
    serverTimestamp
} from "firebase/firestore";

import {
    app,
    db
} from ".";

app;

// Collection Ref
const booksColRef = collection(db, 'books');
const queryBooksByCreatedAt = query(booksColRef, orderBy('createdAt', 'desc'))

// Query Collection Data
// const queryByCreatedAt = query(booksColRef, orderBy('createdAt', 'desc'));

// Get Collection Data
// let books: any[] = [];
// const fetchBooks = async () => {
//     books = [];
//     await getDocs(queryByCreatedAt)
//     // await getDocs(booksColRef)
//         .then((snapshot: any) => {
//             snapshot.docs.forEach((doc: any) => {
//                 books.push({
//                     id: doc.id,
//                     ...doc.data()
//                 });
//             });
//         })
//         .catch(err => {
//             console.log(err.message);
//         })
//     return books;
// }

// Add to Collection Data
const addBook = async (payload: any) => {
    let success: boolean = false;
    let errorInfo: any;
    await addDoc(booksColRef, {
            ...payload,
            createdAt: serverTimestamp()
        })
        .then(() => {
            success = true;
        })
        .catch((err) => {
            success = false;
            errorInfo = err;
        });
    return {
        success,
        errorInfo
    };
};

const updateBook = async ({ id, title, author }: any) => {
    const docRef: any = doc(db, 'books', id);
    let success: boolean = false;
    let errorInfo: any;
    await updateDoc(docRef, {
        title,
        author
    })
        .then(() => {
            success = true;
        })
        .catch((err) => {
            success = false;
            errorInfo = err;
        });
    return {
        success,
        errorInfo
    };
}

// Remove a Document
const deleteBook = async (id: string) => {
    const docRef: any = doc(db, 'books', id);
    let success: boolean = false;
    let errorInfo: any;
    await deleteDoc(docRef)
        .then(() => {
            success = true;
        })
        .catch((err) => {
            success = false;
            errorInfo = err;
        });
    return {
        success,
        errorInfo
    };
};

export {
    addBook,
    updateBook,
    deleteBook,
    booksColRef,
    queryBooksByCreatedAt
};