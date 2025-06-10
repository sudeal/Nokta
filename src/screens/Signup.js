import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../contexts/LanguageContext";

const SignupStep1 = ({ onNext }) => {
  const { translations } = useLanguage();
  const [formData, setFormData] = useState({
    email: "",
    //contactNumber: "+90",
    countryCode: "+90",
    passwordHash: "",
    confirmPassword: "",
  });

  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (password) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    return regex.test(password);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "countryCode") {
      setFormData({
        ...formData,
        [name]: value,
        contactNumber: value,
      });
    } else {
      if (name === "passwordHash") {
        if (!validatePassword(value)) {
          setPasswordError(translations.signup.step1.passwordError);
        } else {
          setPasswordError("");
        }
      }

      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleNext = (e) => {
    e.preventDefault();

    if (formData.passwordHash !== formData.confirmPassword) {
      return alert(translations.signup.step1.passwordMismatch);
    }

    if (passwordError) {
      return alert(translations.signup.step1.fixPasswordError);
    }

    onNext(formData);
  };

  return (
    <form onSubmit={handleNext}>
      <div className="form-group">
        <label>{translations.signup.step1.email}</label>
        <input
          type="email"
          name="email"
          placeholder={translations.signup.step1.emailPlaceholder}
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group phone-group">
        <label>{translations.signup.step1.contactNumber}</label>
        <div className="phone-inputs">
          <select
            name="countryCode"
            value={formData.countryCode}
            onChange={handleChange}
            required
            style={{ width: "30%", marginRight: "10px" }}
          >
            <option value="+90">(+90)</option>
          </select>
          <input
            type="text"
            name="contactNumber"
            placeholder={translations.signup.step1.contactPlaceholder}
            value={formData.contactNumber}
            onChange={handleChange}
            required
            style={{ width: "65%" }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>{translations.signup.step1.password}</label>
        <input
          type="password"
          name="passwordHash"
          placeholder={translations.signup.step1.passwordPlaceholder}
          value={formData.passwordHash}
          onChange={handleChange}
          required
        />
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
      </div>
      <div className="form-group">
        <label>{translations.signup.step1.confirmPassword}</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder={translations.signup.step1.confirmPasswordPlaceholder}
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">{translations.signup.step1.next}</button>
    </form>
  );
};

const SignupStep2 = ({ onNext, formData, handleChange }) => {
  const { translations } = useLanguage();
  const categories = [
    "Health Care",
    "Personal Care",
    "Food & Beverage"
  ];

  const subcategories = {
    "Health Care": ["Dentist", "Vet", "Doctor"],
    "Personal Care": ["Tattoo & Piercing", "Nail Studio", "Female Coiffure", "Male Coiffure"],
    "Food & Beverage": ["Pub & Bar", "Fine Dining", "Dessert", "Restaurant"]
  };

  const handleNext = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleNext}>
      <div>
        <label>
          {translations.signup.step2.name}
          <input
            type="text"
            name="name"
            placeholder={translations.signup.step2.namePlaceholder}
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          {translations.signup.step2.ownerName}
          <input
            type="text"
            name="ownerName"
            placeholder={translations.signup.step2.ownerPlaceholder}
            value={formData.ownerName}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          {translations.signup.step2.category}
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              {translations.signup.step2.selectCategory}
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>
      {formData.category && (
        <div>
          <label>
            {translations.signup.step2.subcategory}
            <select
              name="subcategory"
              value={formData.subcategory || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                {translations.signup.step2.selectSubcategory}
              </option>
              {subcategories[formData.category].map((subcat) => (
                <option key={subcat} value={subcat}>
                  {subcat}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}
      <div>
        <label>
          {translations.signup.step2.address}
          <input
            type="text"
            name="address"
            placeholder={translations.signup.step2.addressPlaceholder}
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          {translations.signup.step2.description}
          <textarea
            name="description"
            placeholder={translations.signup.step2.descriptionPlaceholder}
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <button type="submit">{translations.signup.step2.next}</button>
    </form>
  );
};

const SignupStep3 = ({ formData, onSuccess }) => {
  const navigate = useNavigate();
  const { translations } = useLanguage();
  const [additionalData, setAdditionalData] = useState({
    hasMessaging: true,
    hasStatistics: true,
    hasMenuPrices: true,
    hasDirections: true,
    openingHour: "08:00",
    closingHour: "18:00",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAdditionalData({
      ...additionalData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const convertTimeToInt = (time) => {
    return parseFloat(time.replace(":", "."));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const businessName = formData.subcategory
      ? `${formData.subcategory} - ${formData.name}`
      : formData.name;

    const requestData = {
      name: businessName,
      ownerName: formData.ownerName,
      category: formData.category,
      subcategory: formData.subcategory,
      address: formData.address,
      description: formData.description,
      email: formData.email,
      contactNumber: formData.contactNumber,
      passwordHash: formData.passwordHash,
      openingHour: convertTimeToInt(additionalData.openingHour),
      closingHour: convertTimeToInt(additionalData.closingHour),
      hasMessaging: additionalData.hasMessaging,
      hasStatistics: additionalData.hasStatistics,
      hasMenuPrices: additionalData.hasMenuPrices,
      hasDirections: additionalData.hasDirections,
    };

    try {
      const response = await fetch(
        "https://nokta-appservice.azurewebsites.net/api/Business/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        console.error("Error Response:", error);
        alert(`${translations.signup.step3.registrationFailed} ${error || translations.signup.step3.unknownError}`);
        return;
      }

      const result = await response.json();
      alert(translations.signup.step3.registrationSuccess);
      console.log("Response:", result);

      navigate("/");
    } catch (err) {
      console.error("Fetch Error:", err);
      alert(translations.signup.step3.errorOccurred);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          {translations.signup.step3.openingHour}
          <input
            type="time"
            name="openingHour"
            value={additionalData.openingHour}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          {translations.signup.step3.closingHour}
          <input
            type="time"
            name="closingHour"
            value={additionalData.closingHour}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            name="hasMessaging"
            checked={additionalData.hasMessaging}
            onChange={handleChange}
          />
          {translations.signup.step3.messagingService}
        </label>
        <label>
          <input
            type="checkbox"
            name="hasStatistics"
            checked={additionalData.hasStatistics}
            onChange={handleChange}
          />
          {translations.signup.step3.statistics}
        </label>
        <label>
          <input
            type="checkbox"
            name="hasMenuPrices"
            checked={additionalData.hasMenuPrices}
            onChange={handleChange}
          />
          {translations.signup.step3.menuPrices}
        </label>
        <label>
          <input
            type="checkbox"
            name="hasDirections"
            checked={additionalData.hasDirections}
            onChange={handleChange}
          />
          {translations.signup.step3.directions}
        </label>
      </div>
      <button type="submit">{translations.signup.step3.submit}</button>
    </form>
  );
};

const Signup = () => {
  const { translations } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    category: "",
    subcategory: "",
    address: "",
    description: "",
    email: "",
    contactNumber: "",
    countryCode: "+90",
    passwordHash: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleNext = (data) => {
    setFormData({ ...formData, ...data });
    setStep(step + 1);
  };

  const handlePrevious = () => setStep(step - 1);

  return (
    <div>
      {step === 1 && <SignupStep1 onNext={handleNext} />}
      {step === 2 && (
        <SignupStep2
          onNext={handleNext}
          formData={formData}
          handleChange={handleChange}
        />
      )}
      {step === 3 && <SignupStep3 onSuccess={handleNext} formData={formData} />}

      <div className="button-container">
        {step > 1 && <button onClick={handlePrevious}>{translations.signup.back}</button>}
      </div>
    </div>
  );
};

export default Signup;