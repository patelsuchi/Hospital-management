/* eslint-disable no-unused-vars */
import React, { useContext, useState, useEffect } from "react";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../main";
import axios from "axios";

const UpdateDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const { id } = useParams();
  const navigateTo = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nic: "",
    dob: "",
    gender: "",
    password: "",
    doctorDepartment: "",
    docAvatar: "",
    docAvatarPreview: "",
  });

  const departmentsArray = [
    "Pediatrics",
    "Orthopedics",
    "Cardiology",
    "Neurology",
    "Oncology",
    "Radiology",
    "Physical Therapy",
    "Dermatology",
    "ENT",
  ];

  useEffect(() => {
    // Fetch doctor data based on the ID

    axios
      .get(`http://localhost:4000/api/v1/user/doctors`)
      .then((res) => {
        const doctorData = res.data.doctors;
        console.log(doctorData[0].docAvatar);

        // console.log("my avatr",updatedDocAvtar)

        setFormData({
          firstName: doctorData.firstName,
          lastName: doctorData.lastName,
          email: doctorData.email,
          phone: doctorData.phone,
          nic: doctorData.nic,
          dob: doctorData.dob.subString(0, 10), // Format the date
          gender: doctorData.gender,
          docAvatar: doctorData[0].docAvatar,
          docAvatarPreview: doctorData[0].docAvatar.url,
          // ? doctorData.docAvatar.url
          // : "", // Assuming docAvatar has a URL field
          // If you have an avatar URL, you can set it here
          // docAvatar: doctorData.avatarUrl,
        });
      })
      .catch((error) => {
        console.error("Error fetching doctor data:", error);
      });
  }, [id]);

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setFormData({
        ...formData,
        docAvatarPreview: reader.result,
        docAvatar: file,
      });
    };
    reader.onerror = (error) => {
      console.error("Error reading file:", error);
    };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      const {
        firstName,
        lastName,
        email,
        phone,
        nic,
        dob,
        gender,
        password,
        doctorDepartment,
        docAvatar,
      } = formData;
      const data = new FormData();
      data.append("firstName", firstName);
      data.append("lastName", lastName);
      data.append("email", email);
      data.append("phone", phone);
      data.append("password", password);
      data.append("nic", nic);
      data.append("dob", dob);
      data.append("gender", gender);
      data.append("doctorDepartment", doctorDepartment);
      data.append("docAvatar", docAvatar);
      await axios.put(
        `http://localhost:4000/api/v1/user/doctor/update/${id}`,
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Doctor updated successfully!");
      navigateTo("/");
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <section className="page">
      <section className="container add-doctor-form">
        <img src="/logo.png" alt="logo" className="logo" />
        <h1 className="form-title">UPDATE DOCTOR DETAILS</h1>
        <form onSubmit={handleUpdateDoctor}>
          <div className="first-wrapper">
            <div>
              <img
                src={formData.docAvatarPreview || "/docHolder.jpg"}
                alt="Doctor Avatar"
              />
              <input type="file" name="docAvatar" onChange={handleAvatar} />
            </div>
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="phone"
                placeholder="Mobile Number"
                value={formData.phone}
                onChange={handleInputChange}
              />
              <input
                type="number"
                name="nic"
                placeholder="NIC"
                value={formData.nic}
                onChange={handleInputChange}
              />
              <input
                type={"date"}
                name="dob"
                placeholder="Date of Birth"
                value={formData.dob}
                onChange={handleInputChange}
              />
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
              />
              <select
                name="doctorDepartment"
                value={formData.doctorDepartment}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
                {departmentsArray.map((depart, index) => {
                  return (
                    <option value={depart} key={index}>
                      {depart}
                    </option>
                  );
                })}
              </select>
              <button type="submit">Update Doctor</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default UpdateDoctor;
