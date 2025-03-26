import React, { useState } from "react";

const SignupStep1 = ({ onNext }) => {
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
          setPasswordError(
            "Password must be at least 6 characters long, include 1 uppercase, 1 lowercase, 1 digit, and 1 special character."
          );
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
      return alert("Passwords do not match!");
    }

    if (passwordError) {
      return alert("Please fix the password error.");
    }

    onNext(formData);
  };

  return (
    <form onSubmit={handleNext}>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>
      <div className="form-group phone-group">
        <label>Contact Number</label>
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
            placeholder="Enter your contact number"
            value={formData.contactNumber}
            onChange={handleChange}
            required
            style={{ width: "65%" }}
          />
        </div>
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="passwordHash"
          placeholder="Enter your password"
          value={formData.passwordHash}
          onChange={handleChange}
          required
        />
        {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
      </div>
      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Next</button>
    </form>
  );
};

const SignupStep2 = ({ onNext, formData, handleChange }) => {
  const categories = ["Health Care", "Personal Care", "Food & Beverage"];

  const handleNext = (e) => {
    e.preventDefault();
    onNext();
  };

  return (
    <form onSubmit={handleNext}>
      <div>
        <label>
          Name:
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Owner Name:
          <input
            type="text"
            name="ownerName"
            placeholder="Enter owner's name"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Category:
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          Address:
          <input
            type="text"
            name="address"
            placeholder="Enter your address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div>
        <label>
          Description:
          <textarea
            name="description"
            placeholder="Enter a description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <button type="submit">Next</button>
    </form>
  );
};

const SignupStep3 = ({ formData, onSuccess }) => {
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

    const requestData = {
      name: formData.name,
      ownerName: formData.ownerName,
      category: formData.category,
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
        alert(`Registration failed: ${error || "Unknown error occurred"}`);
        return;
      }

      const result = await response.json();
      alert("Registration successful!");
      console.log("Response:", result);

      onSuccess();
    } catch (err) {
      console.error("Fetch Error:", err);
      alert(
        "An error occurred while sending the request. Check console for details."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          Opening Hour:
          <input
            type="time"
            name="openingHour"
            value={additionalData.openingHour}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Closing Hour:
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
          Messaging Service
        </label>
        <label>
          <input
            type="checkbox"
            name="hasStatistics"
            checked={additionalData.hasStatistics}
            onChange={handleChange}
          />
          Statistics
        </label>
        <label>
          <input
            type="checkbox"
            name="hasMenuPrices"
            checked={additionalData.hasMenuPrices}
            onChange={handleChange}
          />
          Menu and Prices
        </label>
        <label>
          <input
            type="checkbox"
            name="hasDirections"
            checked={additionalData.hasDirections}
            onChange={handleChange}
          />
          Directions
        </label>
      </div>
      <button type="submit">Submit</button>
    </form>
  );
};

const Signup = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    ownerName: "",
    category: "",
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
        {step > 1 && <button onClick={handlePrevious}>Back</button>}
      </div>
    </div>
  );
};

export default Signup;