import { 
    addDoc, 
    getDocs,
    deleteDoc,
    doc
} from "firebase/firestore";
import { 
    db,
    booksColRef
} from ".";

// Get Collection Data
let books: any[] = [];
const fetchBooks = async () => {
    books = [];
    await getDocs(booksColRef)
        .then((snapshot: any) => {
            snapshot.docs.forEach((doc: any) => {
                books.push({
                    id: doc.id,
                    ...doc.data()
                });
            });
        })
        .catch(err => {
            console.log(err.message);
        })
    return books;
}

const addBook = async (payload: any) => {
    let success: boolean = false;
    let errorInfo: any;
    await addDoc(booksColRef, payload)
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
    fetchBooks,
    addBook,
    deleteBook,
};