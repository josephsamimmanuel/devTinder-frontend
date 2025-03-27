import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { validateEmail, validatePassword, validateFirstName, validateLastName } from "../utils/validation";

const Login = () => {
  const [formValues, setFormValues] = useState({
    emailId: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [isLoginFrom, setIsLoginForm] = useState(true);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: ""
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Reset errors when the component mounts or when the form type changes
    setErrors({
      email: "",
      password: "",
      firstName: "",
      lastName: ""
    });
    setFormValues({
      emailId: "",
      password: "",
      firstName: "",
      lastName: "",
    });
  }, [isLoginFrom]);

  const handleLogin = async () => {
    if (!handleValidation()) {
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        {
          emailId: formValues.emailId,
          password: formValues.password,
        },
        { withCredentials: true }
      );
      // console.log(res?.data?.data)
      dispatch(addUser(res?.data?.data));
      return navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  const handleSignUp = async () => {
    if (!handleValidation()) {
      return;
    }
    try {
      const res = await axios.post(
        BASE_URL + "/signup",
        formValues.firstName,
        formValues.lastName,
        formValues.emailId,
        formValues.password,
        { 
          withCredentials: true 
        }
      );
      console.log(res);
      dispatch(addUser(res.data.data));
      return navigate("/profile");
    } catch (error) {
      console.log(error);
    }
  };

    // Performs validation on the field
    const validateField = (field, value) => {
      switch (field) {
        case 'email':
          return validateEmail(value) ? "" : "Invalid email";
        case 'password':
          return validatePassword(value) ? "" : "Invalid password";
        case 'firstName':
          return validateFirstName(value) ? "" : "Invalid first name";
        case 'lastName':
          return validateLastName(value) ? "" : "Invalid last name";
        default:
          return "";
      }
    };

  // Validation to check if the fields are valid - avoids api call if not valid
  const handleValidation = () => {
    const newErrors = {
      email: formValues.emailId === "" ? "Email is required" : validateField('email', formValues.emailId),
      password: formValues.password === "" ? "Password is required" : validateField('password', formValues.password),
      firstName: !isLoginFrom ? formValues.firstName === "" ? "First name is required" : validateField('firstName', formValues.firstName) : "",
      lastName: !isLoginFrom ? formValues.lastName === "" ? "Last name is required" : validateField('lastName', formValues.lastName) : ""
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  // Updates the form values and errors when the field is changed
  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    
    // Update form values
    setFormValues(prev => ({
      ...prev,
      [field]: value
    }));

    // Update errors
    setErrors(prev => ({
      ...prev,
      [field === 'emailId' ? 'email' : field]: value === "" 
        ? `${field === 'emailId' ? 'Email' : field.charAt(0).toUpperCase() + field.slice(1)} is required` 
        : validateField(field === 'emailId' ? 'email' : field, value)
    }));
  };

  return (
    <div className="flex justify-center my-10">
      <div className="card bg-base-300 w-96 shadow-xl">
        <div className="card-body">
          <h2 className="card-title justify-center">
            {isLoginFrom ? "Login" : "Signup"}
          </h2>
          <div>
            {!isLoginFrom && (
              <>
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Firstname</span>
                  </div>
                  <input
                    type="text"
                    value={formValues.firstName}
                    onChange={handleFieldChange('firstName')}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                {errors.firstName && (
                  <div className="text-red-500 text-sm mt-1">{errors.firstName}</div>
                )}
                <label className="form-control w-full max-w-xs my-2">
                  <div className="label">
                    <span className="label-text">Lastname</span>
                  </div>
                  <input
                    type="text"
                    value={formValues.lastName}
                    onChange={handleFieldChange('lastName')}
                    className="input input-bordered w-full max-w-xs"
                  />
                </label>
                {errors.lastName && (
                  <div className="text-red-500 text-sm mt-1">{errors.lastName}</div>
                )}
              </>
            )}
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Email</span>
              </div>
              <input
                type="text"
                value={formValues.emailId}
                onChange={handleFieldChange('emailId')}
                className="input input-bordered w-full max-w-xs"
              />
            </label>
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
            <label className="form-control w-full max-w-xs my-2">
              <div className="label">
                <span className="label-text">Password</span>
              </div>
              <input
                type="password"
                value={formValues.password}
                onChange={handleFieldChange('password')}
                className="input input-bordered w-full max-w-xs"
              />
            </label>
            {errors.password && (
              <div className="text-red-500 text-sm mt-1">{errors.password}</div>
            )}
          </div>
          {/* <p className="text-red-500 text-center">{validateError}</p> */}
          <div className="card-actions justify-center mt-2">
            <button
              className="btn btn-primary"
              onClick={isLoginFrom ? handleLogin : handleSignUp}
            >
              {isLoginFrom ? "Login" : "Signup"}
            </button>
          </div>
          <p
            className=" text-center cursor-pointer py-2"
            onClick={() => setIsLoginForm((value) => !value)}
          >
            {isLoginFrom
              ? "New user ? signup here"
              : "Existing User ? Login here"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
