import { createContext, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import PackagesPage from './pages/PackagesPage/PackagesPage';
import ContactPage from './pages/ContactPage/ContactPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import { db, storage } from './firebase.config';
// import { ref, uploadBytes } from 'firebase/storage';
import { collection, onSnapshot, doc, addDoc, deleteDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';

export const AppContext = createContext();

function App() {
  // REVIEWS(state & firebase logic)
  const [review, setReview] = useState({ name: "", review: "", stars: 0 });
  const [updatedReview, setUpdatedReview] = useState({ id: "", name: "", review: "", stars: 0 });
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewsIsAdding, setReviewsIsAdding] = useState(false);
  const [reviewsIsUpdating, setReviewsIsUpdating] = useState(false);
  const [reviewWarning, setReviewWarning] = useState("");
  const reviewsCollectionRef = collection(db, "reviews");
  const reviewQ = query(reviewsCollectionRef, orderBy("createdAt"));
  const getReviewsList = () => {
    onSnapshot(reviewQ, snapshot => {
      setReviewsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    const enteredReviewName = review.name;
    const enteredReview = review.review;
    const enteredStars = review.stars;
    if (enteredReviewName === "") {
      setReviewWarning("You must enter a name");
    } else if (enteredReview === "") {
      setReviewWarning("You must enter your review");
    } else if (enteredStars === 0) {
      setReviewWarning("You must select a star rating");
    } else {
      addDoc(reviewsCollectionRef, {
        name: enteredReviewName,
        review: enteredReview,
        stars: enteredStars,
        createdAt: serverTimestamp()
      })
        .then(() => {
          setReview({ name: "", review: "", stars: 0 });
          setReviewsIsAdding(false);
          setReviewWarning("");
        });
    };
  };
  const deleteReview = id => {
    const docRef = doc(db, "reviews", id);
    deleteDoc(docRef);
  };
  const submitUpdatedReview = (e) => {
    e.preventDefault();
    const enteredReviewName = updatedReview.name;
    const enteredReview = updatedReview.review;
    const enteredStars = updatedReview.stars;
    const docRef = doc(db, "reviews", updatedReview.id);
    if (enteredReviewName === "") {
      setReviewWarning("You must enter a name");
    } else if (enteredReview === "") {
      setReviewWarning("You must enter your review");
    } else if (enteredStars === 0) {
      setReviewWarning("You must select a star rating");
    } else {
      updateDoc(docRef, {
        name: enteredReviewName,
        review: enteredReview,
        stars: enteredStars
      })
        .then(() => {
          setUpdatedReview({ id: "", name: "", review: "", stars: 0 });
          setReviewsIsUpdating(false);
          setReviewWarning("");
        });
    };
  };

  // PROJECTS(state & firebase logic)
  const [project, setProject] = useState({ title: "", img: null });

  const [projectsList, setProjectsList] = useState([]);

  const [projectsIsAdding, setProjectsIsAdding] = useState(false);
  const [projectsIsUpdating, setProjectsIsUpdating] = useState(false);

  const projectsCollectionRef = collection(db, "projects");
  const projectQ = query(projectsCollectionRef, orderBy("createdAt"));
  const getProjectsList = () => {
    onSnapshot(projectQ, snapshot => {
      setProjectsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };
  const handleProjectSubmit = (e) => {
    e.preventDefault();
    const enteredProjectTitle = project.title;
    const uploadedImg = project.img;
    addDoc(projectsCollectionRef, {
      title: enteredProjectTitle,
      img: uploadedImg,
      createdAt: serverTimestamp()
    })
      .then(() => {
        setProject({ title: "", img: null });
        setProjectsIsAdding(false);
      });
  };

  // FAQS(state & firebase logic)
  const [faq, setFaq] = useState({ question: "", answer: "" });
  const [updatedFaq, setUpdatedFaq] = useState({ id: "", question: "", answer: "" });
  const [faqsList, setFaqsList] = useState([]);
  const [faqsIsAdding, setFaqsIsAdding] = useState(false);
  const [faqsIsUpdating, setFaqsIsUpdating] = useState(false);
  const [faqWarning, setFaqWarning] = useState("");
  const faqsCollectionRef = collection(db, "faqs");
  const faqQ = query(faqsCollectionRef, orderBy("createdAt"));
  const getFaqsList = () => {
    onSnapshot(faqQ, snapshot => {
      setFaqsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };
  const handleFaqSubmit = (e) => {
    e.preventDefault();
    const enteredQuestion = faq.question;
    const enteredAnswer = faq.answer;
    if (enteredQuestion === "") {
      setFaqWarning("You must enter a question");
    } else if (enteredAnswer === "") {
      setFaqWarning("You must enter your answer");
    } else {
      addDoc(faqsCollectionRef, {
        question: enteredQuestion,
        answer: enteredAnswer,
        createdAt: serverTimestamp()
      })
        .then(() => {
          setFaq({ question: "", answer: "" });
          setFaqsIsAdding(false);
          setFaqWarning("");
        });
    };
  };
  const deleteFaq = id => {
    const docRef = doc(db, "faqs", id);
    deleteDoc(docRef);
  };
  const submitUpdatedFaq = (e) => {
    e.preventDefault();
    const enteredQuestion = updatedFaq.question;
    const enteredAnswer = updatedFaq.answer;
    const docRef = doc(db, "faqs", updatedFaq.id);
    if (enteredQuestion === "") {
      setFaqWarning("You must enter a question");
    } else if (enteredAnswer === "") {
      setFaqWarning("You must enter your answer");
    } else {
      updateDoc(docRef, {
        question: enteredQuestion,
        answer: enteredAnswer
      })
        .then(() => {
          setUpdatedFaq({ id: "", question: "", answer: "" });
          setFaqsIsUpdating(false);
          setFaqWarning("");
        });
    };
  };

  return (
    <div className="container">
      <AppContext.Provider value={{
        // reviews
        review,
        setReview,
        reviewsList,
        getReviewsList,
        handleReviewSubmit,
        reviewsIsAdding,
        setReviewsIsAdding,
        deleteReview,
        reviewsIsUpdating,
        setReviewsIsUpdating,
        updatedReview,
        setUpdatedReview,
        submitUpdatedReview,
        reviewWarning,
        setReviewWarning,
        // projects
        project,
        setProject,
        handleProjectSubmit,
        projectsIsAdding,
        setProjectsIsAdding,
        projectsIsUpdating,
        setProjectsIsUpdating,
        getProjectsList,
        projectsList,
        // faqs
        faq,
        setFaq,
        updatedFaq,
        setUpdatedFaq,
        faqsList,
        getFaqsList,
        faqsIsAdding,
        setFaqsIsAdding,
        faqsIsUpdating,
        setFaqsIsUpdating,
        faqWarning,
        setFaqWarning,
        handleFaqSubmit,
        deleteFaq,
        submitUpdatedFaq
      }}>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/packages" element={<PackagesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </AppContext.Provider>
    </div>
  );
}

export default App;
