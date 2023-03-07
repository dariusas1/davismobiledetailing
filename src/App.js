import { createContext, useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage/HomePage';
import PackagesPage from './pages/PackagesPage/PackagesPage';
import ContactPage from './pages/ContactPage/ContactPage';
import DashboardPage from './pages/DashboardPage/DashboardPage';
import LoginPage from './pages/LoginPage/LoginPage';
import { db } from './firebase.config';
import { auth } from './firebase.config';
import { collection, onSnapshot, doc, addDoc, deleteDoc, updateDoc, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from '@firebase/auth';
import ProtectedRoutes from './ProtectedRoutes';
import PublicRoutes from './PublicRoutes';

export const AppContext = createContext();

function App() {

  // PROJECTS(state & firebase logic)
  const [projectsList, setProjectsList] = useState([]);
  const [isProjModalActive, setIsProjModalActive] = useState(false);
  const [projectInfo, setProjectInfo] = useState({ title: "", imgs: [] });
  const projectsCollectionRef = collection(db, "projects");
  const projectQ = query(projectsCollectionRef, orderBy("projID", "desc"));

  const getProjectsList = () => {
    onSnapshot(projectQ, snapshot => {
      setProjectsList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const deleteProject = id => {
    const docRef = doc(db, "projects", id);
    deleteDoc(docRef);
  };

  // PACKAGES(state & firebase logic)
  const [packagePlan, setPackagePlan] = useState({ name: "", pricing: [], features: [] });
  const [updatedPackagePlan, setUpdatedPackagePlan] = useState({ id: "", name: "", pricing: [], features: [] });
  const [packagesList, setPackagesList] = useState([]);
  const [packagesIsAdding, setPackagesIsAdding] = useState(false);
  const [enteredPricing, setEnteredPricing] = useState({ carType: "", price: "" });
  const [enteredUpdatedPricing, setEnteredUpdatedPricing] = useState({ carType: "", price: "" });
  const [enteredFeature, setEnteredFeature] = useState({ feature: "", color: "" });
  const [enteredUpdatedFeature, setEnteredUpdatedFeature] = useState({ feature: "", color: "" });
  const [packagesIsUpdating, setPackagesIsUpdating] = useState(false);
  const [packageWarning, setPackageWarning] = useState("");
  const [isPkgModalActive, setIsPkgModalActive] = useState(false);
  const packagesCollectionRef = collection(db, "packages");
  const packageQ = query(packagesCollectionRef, orderBy("createdAt"));

  const getPackagesList = () => {
    onSnapshot(packageQ, snapshot => {
      setPackagesList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
  };

  const handlePackageSubmit = (e) => {
    e.preventDefault();
    const enteredName = packagePlan.name;
    const featureArr = packagePlan.features;
    const pricingArr = packagePlan.pricing;
    if (enteredName === "") {
      setPackageWarning("You must name your package");
    } else if (pricingArr.length === 0) {
      setPackageWarning("You must enter at least 1 car type/price");
    } else if (featureArr.length === 0) {
      setPackageWarning("You must enter at least 1 feature");
    } else {
      addDoc(packagesCollectionRef, {
        name: enteredName,
        features: featureArr,
        pricing: pricingArr,
        createdAt: serverTimestamp()
      })
        .then(() => {
          setPackagePlan({ name: "", pricing: [], features: [] });
          setPackagesIsAdding(false);
          setPackageWarning("");
        });
    };
  };

  const submitUpdatedPackage = (e) => {
    e.preventDefault();
    const enteredName = updatedPackagePlan.name;
    const pricingArr = updatedPackagePlan.pricing;
    const featureArr = updatedPackagePlan.features;
    const docRef = doc(db, "packages", updatedPackagePlan.id);
    if (enteredName === "") {
      setPackageWarning("You must name your package");
    } else if (pricingArr.length === 0) {
      setPackageWarning("You must enter at least 1 car type/price");
    } else if (featureArr.length === 0) {
      setPackageWarning("You must enter at least 1 feature");
    } else {
      updateDoc(docRef, {
        name: enteredName,
        pricing: pricingArr,
        features: featureArr
      })
        .then(() => {
          setUpdatedPackagePlan({ id: "", name: "", pricing: [], features: [] });
          setPackagesIsUpdating(false);
          setPackageWarning("");
        });
    };
  };

  const deletePackage = id => {
    const docRef = doc(db, "packages", id);
    deleteDoc(docRef);
  };

  const handlePricing = () => {
    const newCarType = enteredPricing.carType;
    const newPrice = enteredPricing.price;
    const pricingArr = packagePlan.pricing;
    const newPricingArr = [...pricingArr, { carType: newCarType, price: newPrice }];
    if (newCarType === "") {
      setPackageWarning("You can't enter an empty car type");
    } else if (newPrice === "") {
      setPackageWarning("You must enter a price");
    } else {
      setPackagePlan({
        ...packagePlan,
        pricing: newPricingArr
      });
      setEnteredPricing({
        carType: "",
        price: ""
      });
      setPackageWarning("");
    }
  };

  const handleUpdatedPricing = () => {
    const newCarType = enteredUpdatedPricing.carType;
    const newPrice = enteredUpdatedPricing.price;
    const pricingArr = updatedPackagePlan.pricing;
    const newPricingArr = [...pricingArr, { carType: newCarType, price: newPrice }];
    if (newCarType === "") {
      setPackageWarning("You can't enter an empty car type");
    } else if (newPrice === "") {
      setPackageWarning("You must enter a price");
    } else {
      setUpdatedPackagePlan({
        ...updatedPackagePlan,
        pricing: newPricingArr
      });
      setEnteredUpdatedPricing({
        carType: "",
        price: ""
      });
      setPackageWarning("");
    }
  };

  const removeSelectedPricing = (e) => {
    const selectedCarType = e.target.dataset.cartype
    const pricingArr = packagePlan.pricing;
    const filteredItems = pricingArr.filter(item => item.carType !== selectedCarType);
    setPackagePlan({
      ...packagePlan,
      pricing: filteredItems
    });
  };

  const removeSelectedUpdatedPricing = (e) => {
    const selectedCarType = e.target.dataset.cartype
    const pricingArr = updatedPackagePlan.pricing;
    const filteredItems = pricingArr.filter(item => item.carType !== selectedCarType);
    setUpdatedPackagePlan({
      ...updatedPackagePlan,
      pricing: filteredItems
    });
  };

  const handleFeature = () => {
    const newFeature = enteredFeature.feature;
    const newFeatureColor = enteredFeature.color;
    const featuresArr = packagePlan.features;
    const newFeaturesArr = [...featuresArr, { feature: newFeature, color: newFeatureColor }];
    if (newFeature === "") {
      setPackageWarning("You can't enter an empty feature");
    } else if (newFeatureColor === "") {
      setPackageWarning("You must choose either a blue or green icon for your feature");
    } else {
      setPackagePlan({
        ...packagePlan,
        features: newFeaturesArr
      });
      setEnteredFeature({
        feature: "",
        color: ""
      });
      setPackageWarning("");
    }
  };

  const handleUpdatedFeature = () => {
    const newFeature = enteredUpdatedFeature.feature;
    const newFeatureColor = enteredUpdatedFeature.color;
    const featuresArr = updatedPackagePlan.features;
    const newFeaturesArr = [...featuresArr, { feature: newFeature, color: newFeatureColor }];
    if (newFeature === "") {
      setPackageWarning("You can't enter an empty feature");
    } else if (newFeatureColor === "") {
      setPackageWarning("You must choose either a blue or green icon for your feature");
    } else {
      setUpdatedPackagePlan({
        ...updatedPackagePlan,
        features: newFeaturesArr
      });
      setEnteredUpdatedFeature({
        feature: "",
        color: ""
      });
      setPackageWarning("");
    }
  };

  const removeSelectedFeature = (e) => {
    const selectedFeature = e.target.dataset.feature
    const featuresArr = packagePlan.features;
    const filteredItems = featuresArr.filter(item => item.feature !== selectedFeature);
    setPackagePlan({
      ...packagePlan,
      features: filteredItems
    });
  };

  const removeSelectedUpdatedFeature = (e) => {
    const selectedFeature = e.target.dataset.feature
    const featuresArr = updatedPackagePlan.features;
    const filteredItems = featuresArr.filter(item => item.feature !== selectedFeature);
    setUpdatedPackagePlan({
      ...updatedPackagePlan,
      features: filteredItems
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

  // LoginPage (state & firebase logic)
  const [user, setUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: "", password: "", error: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (user && window.location.pathname != "/dashboard") {
      navigate("/dashboard");
    }
    if (!user && window.location.pathname == "/" || !user && window.location.pathname == "/packages" || !user && window.location.pathname == "/contact" || !user && window.location.pathname == "/login") {
      return;
    } else {
      navigate("/");
    }
  }, [user]);

  const login = (e) => {
    e.preventDefault();
    const email = loginForm.email;
    const password = loginForm.password;
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        navigate("/dashboard");
      }).catch((err) => {
        setLoginForm({ ...loginForm, error: "Username or password is incorrect" });
        console.log(err);
      });
  };

  const logout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      }).catch((err) => console.loog(err))
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
        getProjectsList,
        projectsList,
        deleteProject,
        isProjModalActive,
        setIsProjModalActive,
        projectInfo,
        setProjectInfo,
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
        submitUpdatedFaq,
        // packages
        packagePlan,
        setPackagePlan,
        packagesList,
        packagesIsAdding,
        setPackagesIsAdding,
        getPackagesList,
        handlePackageSubmit,
        deletePackage,
        handleFeature,
        enteredFeature,
        setEnteredFeature,
        removeSelectedFeature,
        packageWarning,
        setPackageWarning,
        submitUpdatedPackage,
        handleUpdatedFeature,
        updatedPackagePlan,
        setUpdatedPackagePlan,
        setEnteredUpdatedFeature,
        enteredUpdatedFeature,
        setPackagesIsUpdating,
        packagesIsUpdating,
        removeSelectedUpdatedFeature,
        enteredPricing,
        setEnteredPricing,
        handlePricing,
        removeSelectedPricing,
        enteredUpdatedPricing,
        setEnteredUpdatedPricing,
        handleUpdatedPricing,
        removeSelectedUpdatedPricing,
        isPkgModalActive,
        setIsPkgModalActive,
        // Login
        loginForm,
        setLoginForm,
        login,
        logout,
        user
      }}>
        <Routes>
          <Route element={<PublicRoutes />}>
            <Route exact path="/" element={<HomePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/login" element={<LoginPage />} />
          </Route>
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashboardPage />} />
          </Route>
        </Routes>
      </AppContext.Provider>
    </div>
  );
}

export default App;