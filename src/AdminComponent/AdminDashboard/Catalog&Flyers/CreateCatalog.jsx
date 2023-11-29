import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import Starlogo from "../../../assets/img/logo.png";
import { useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import { FaFileDownload, FaFileUpload } from "react-icons/fa";
import ProfileBar from "../ProfileBar";
import { Button } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Swal from "sweetalert2";
import moment from "moment";

const CreateCatalog = () => {
  const [template, setTemplate] = useState(1);
  const [formValues, setFormValues] = useState([
    {
      page: [],
      images: [],
      staticImages: [],
      Banners: [],
      Headers: [],
    },
  ]);

  const addFormFields = (e) => {
    setFormValues([
      ...formValues,
      {
        page: [],
        images: [],
        staticImages: [],
        Banners: [],
        Headers: [],
      },
    ]);
  };
  const removeFormFields = (index) => {
    let newFormValues = [...formValues];
    newFormValues?.splice(index, 1);
    setFormValues(newFormValues);
  };

  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getUser`;
  const uploadImage = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/imageUpload`;
  const apiUrl2 = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/editUserProfile`;
  const cityApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/cityByState`;
  const [loader, setLoader] = useState(false);
  const [files, setFiles] = useState({
    imageProfile: "",
    federalTaxId: "",
    businessLicense: "",
    tobaccoLicence: "",
    salesTaxId: "",
    accountOwnerId: "",
  });

  const [newExpiry, setNewExpiry] = useState("");
  const [newExpiry2, setNewExpiry2] = useState();
  const [sideBar, setSideBar] = useState(true);
  const [user, setUser] = useState([]);
  const [prodImg, setProdImg] = useState();
  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");
  const objectId = localStorage.getItem("objectId");
  const navigate = useNavigate();
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [cities, setCities] = useState([]);

  const handleCities = async (state) => {
    const { data } = await axios.post(cityApi, {
      state: state,
    });
    if (!data.error) {
      setCities(data?.results?.states);
    }
  };

  useEffect(() => {
    handleCities();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onProfileSelection = async (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
    const formData = new FormData();
    formData.append("productImage", e.target.files[0]);

    await axios.post(uploadImage, formData).then((res) => {
      setProdImg(res.data?.results?.productImage);
    });
  };
  const onFileSelection = async (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const onSubmit = async (data) => {
    setLoader(true);
    console.log(data?.city);
    const formData = new FormData();
    formData.append("profileImage", files?.imageProfile);
    formData.append("companyName", data?.companyName?.trim());
    formData.append("dba", data?.dba?.trim());
    formData.append("addressLine1", data?.addressLine1?.trim());
    formData.append("addressLine2", data?.addressLine2?.trim());
    formData.append("city", data?.city ? data?.city : user?.city);
    formData.append("state", data?.state);
    formData.append("zipcode", data?.zipcode);
    formData.append("firstName", data?.firstName?.trim());
    formData.append("lastName", data?.lastName?.trim());
    formData.append("email", data?.email?.trim());
    formData.append("phoneNumber", data?.phoneNumber);
    formData.append("businessPhoneNumber", data?.businessNumber);
    formData.append("businessNumber", data?.businessNumber);
    formData.append("federalTaxId", files?.federalTaxId);
    formData.append("businessLicense", files?.businessLicense);
    formData.append("tobaccoLicence", files?.tobaccoLicence);
    formData.append("salesTaxId", files?.salesTaxId);
    formData.append("accountOwnerId", files?.accountOwnerId);
    formData.append("heardAboutUs", data?.heardAboutUs);
    formData.append(
      "multipleUsers",
      data?.multipleUsers ? data?.multipleUsers : user?.multipleUsers
    );
    formData.append("quotation", data?.quotation ? data?.quotation : "");
    formData.append(
      "istobaccoLicenceExpired",
      data?.License ? data?.License : user?.istobaccoLicenceExpired
    );
    formData.append(
      "tobaccoLicenceExpiry",
      newExpiry.replaceAll("/", "-") ||
        newExpiry2 ||
        user?.tobaccoLicenceExpiry.replaceAll("/", "-")
    );

    await axios
      .post(apiUrl2 + "/" + objectId, formData)
      .then((res) => {
        if (res?.data.error) {
          Swal.fire({
            title: res.data.message,
            icon: "error",
            button: "Okay",
          });
          setLoader(false);
        }
        if (res?.data.message === "User Deatils Updated Successfully") {
          setLoader(false);
          navigate("/UserManage/ApprovedView");
        }
        if (res?.data.message === "Invalid file format") {
          setLoader(false);
          Swal.fire({
            title: "Invalid File Format!",
            text: "Only images/pdf/docs are allowed.",
            icon: "error",
            button: "Ok",
          });
          setFiles(null);
          getUser();
        }
        if (res?.data.message === "Email is already registered") {
          setLoader(false);
          Swal.fire({
            title: "Email is Already registered!",
            icon: "error",
            button: "Ok",
          });
        }
        if (res?.data.message === "Phone is already registered") {
          setLoader(false);
          Swal.fire({
            title: "Phone is already registered!",
            icon: "error",
            button: "Ok",
          });
        }
        if (res?.data.message === "Please provide proper date") {
          setLoader(false);
          Swal.fire({
            title: "Please provide proper date!",
            text: "Give further date from today",
            icon: "error",
            button: "Ok",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
        if (err.response.data.error) {
          Swal.fire({
            title: "Error!",
            icon: "error",
            button: "Ok",
          });
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const res = await axios.post(apiUrl + "/" + objectId);
    let date = res.data.results?.tobaccoLicenceExpiry;
    console.log(date);
    setUser(res.data.results);
    document.getElementById("expiryDate").defaultValue = date.slice(0, 10);
    handleCities(res?.data?.results?.state);
    return res.data;
  };

  const handleClick = () => {
    localStorage.removeItem("AdminData");
    localStorage.removeItem("AdminLogToken");
    localStorage.removeItem("AdminEmail");
  };
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("expiryDate")?.setAttribute("min", today);

  return (
    <div className={sideBar ? "admin_main" : "expanded_main"}>
      <div className={sideBar ? "siderbar_section" : "d-none"}>
        <div className="siderbar_inner">
          <div className="sidebar_logo">
            <Link to="" className="">
              <img src={Starlogo} alt="Logo" />{" "}
            </Link>
          </div>
          <div className="sidebar_menus">
            {User?.type === "SubAdmin" ? (
              <ul className="list-unstyled ps-1 m-0">
                <li
                  className={
                    User?.access?.includes("Dashboard") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/AdminDashboard"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "2px",
                      }}
                      className="fa fa-home"></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("User Management") ? "" : "d-none"
                  }>
                  <Link
                    className="bg-white"
                    to="/UserManage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-user"></i>{" "}
                    User Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Category Sub-Category Management")
                      ? ""
                      : "d-none"
                  }>
                  <Link
                    className=""
                    to="/CategorySub"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-layer-group"></i>{" "}
                    Category &amp; Sub Category
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Inventory Management")
                      ? ""
                      : "d-none"
                  }>
                  <Link
                    className=""
                    to="/Inventory"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "6px",
                        top: "3px",
                      }}
                      class="far fa-building"></i>{" "}
                    Inventory Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Brands Management") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/brandsManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-ship"></i>{" "}
                    Brands Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Sub-Admin") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fas fa-user-cog"></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>

                <li
                  className={User?.access?.includes("Puller") ? "" : "d-none"}>
                  <Link
                    className="d-none ata"
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-users-gear"></i>{" "}
                    Puller Management
                  </Link>
                </li>

                <li
                  className={User?.access?.includes("Gallery") ? "" : "d-none"}>
                  <Link
                    className=""
                    to="/Gallery-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-image"></i>{" "}
                    Gallery Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("catalogFlyers") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-book"></i>{" "}
                    Catalog & Flyers
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Orders Management") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/OrderRequest"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-layer-group"></i>{" "}
                    Order Management
                  </Link>
                </li>
                <li className={User?.access?.includes("CMS") ? "" : "d-none"}>
                  <Link
                    className=""
                    to="/Cms"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-cog"></i>{" "}
                    Content Management
                  </Link>
                </li>
                <li
                  className={User?.access?.includes("Contact") ? "" : "d-none"}>
                  <Link
                    className=""
                    to="/Contact&Support"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-handshake-angle"></i>{" "}
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/AdminLogin"
                    onClick={handleClick}
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-sign-out-alt"></i>
                    Logout
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="list-unstyled ps-1 m-0">
                <li>
                  <Link
                    className=""
                    to="/AdminDashboard"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "2px",
                      }}
                      className="fa fa-home"></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    className="bg-white"
                    to="/UserManage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-user"></i>{" "}
                    User Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/CategorySub"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-layer-group"></i>{" "}
                    Category &amp; Sub Category
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Inventory"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{
                        position: "relative",
                        left: "6px",
                        top: "3px",
                      }}
                      class="far fa-building"></i>{" "}
                    Inventory Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/brandsManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-ship"></i>{" "}
                    Brands Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fas fa-user-cog"></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>
                <li>
                  <Link
                    className="d-none at"
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-users-gear"></i>{" "}
                    Puller Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Gallery-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-image"></i>{" "}
                    Gallery Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-book"></i>{" "}
                    Catalog & Flyers
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/OrderRequest"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-layer-group"></i>{" "}
                    Order Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Cms"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-cog"></i>{" "}
                    Content Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Contact&Support"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-handshake-angle"></i>{" "}
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/AdminLogin"
                    onClick={handleClick}
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-sign-out-alt"></i>
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      <div className="admin_main_inner">
        <div className="admin_header shadow">
          <div className="row align-items-center mx-0 justify-content-between w-100">
            <div className="col">
              {sideBar ? (
                <div>
                  <h1
                    className="mt-2 text-white"
                    onClick={() => {
                      console.log("yello");
                      setSideBar(!sideBar);
                    }}>
                    <i className="fa fa-bars"></i>
                  </h1>
                </div>
              ) : (
                <div>
                  <h3 className="">
                    <button
                      onClick={(e) => {
                        console.log(e);
                        setSideBar(!sideBar);
                      }}>
                      X
                    </button>
                  </h3>
                </div>
              )}
            </div>
            <div className="col-auto d-flex ml-5">
              <ProfileBar />
            </div>
          </div>
        </div>
      </div>
      <div className="admin_panel_data height_adjust">
        {(formValues || [])?.map((item, index) => (
          <div className="row Pending-view justify-content-center">
            <div className="col-12">
              <div className="row mx-0">
                <div className="col-12 design_outter_comman recent_orders shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2 className="main_headers">
                        Catalog - Page {index + 1}
                      </h2>
                    </div>
                    <div className="col-auto">
                      <button
                        className="comman_btn "
                        type="button"
                        disabled={formValues?.length <= 1 ? true : false}
                        onClick={() => removeFormFields(index)}>
                        <i className="fa fa-minus mt-1 mx-1" />
                      </button>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 p-4 Pending-view-main">
                      <form
                        className="row py-2 form-design"
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmit)}>
                        <label className="fw-bold fs-6 mb-2">
                          Page Templates : Choose one
                        </label>
                        <div className="row text-start mb-4">
                          <div className="form-group col-auto">
                            <div className=" position-relative d-inline-block">
                              <div className="mb-2 ">
                                <img
                                  className="Template_img"
                                  src={require("../../../assets/img/tempIntro.png")}
                                  alt="Upload Image ........"
                                />
                              </div>
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  value=""
                                  defaultChecked={true}
                                  id="flexCheckDefault"
                                  onClick={() => {
                                    setTemplate(1);
                                  }}
                                  name="tempRadio"
                                />
                                <label
                                  class="form-check-label"
                                  for="flexCheckDefault">
                                  Select
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-auto">
                            <div className=" position-relative d-inline-block">
                              <div className="mb-2 ">
                                <img
                                  className="Template_img"
                                  src={require("../../../assets/img/Temp1.png")}
                                  alt="Upload Image ........"
                                />
                              </div>
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  value=""
                                  onClick={() => {
                                    setTemplate(2);
                                  }}
                                  id="flexCheckDefault2"
                                  name="tempRadio"
                                />
                                <label
                                  class="form-check-label"
                                  for="flexCheckDefault2">
                                  Select
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-auto">
                            <div className=" position-relative d-inline-block">
                              <div className="mb-2 ">
                                <img
                                  className="Template_img"
                                  src={require("../../../assets/img/Temp2.png")}
                                  alt="Upload Image ........"
                                />
                              </div>
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  value=""
                                  onClick={() => {
                                    setTemplate(3);
                                  }}
                                  id="flexCheckDefault3"
                                  name="tempRadio"
                                />
                                <label
                                  class="form-check-label"
                                  for="flexCheckDefault3">
                                  Select
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-auto">
                            <div className=" position-relative d-inline-block">
                              <div className="mb-2 ">
                                <img
                                  className="Template_img"
                                  src={require("../../../assets/img/temp3.png")}
                                  alt="Upload Image ........"
                                />
                              </div>
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  value=""
                                  onClick={() => {
                                    setTemplate(4);
                                  }}
                                  id="flexCheckDefault4"
                                  name="tempRadio"
                                />
                                <label
                                  class="form-check-label"
                                  for="flexCheckDefault4">
                                  Select
                                </label>
                              </div>
                            </div>
                          </div>

                          <div className="form-group col-auto">
                            <div className=" position-relative d-inline-block">
                              <div className="mb-2 ">
                                <img
                                  className="Template_img"
                                  src={require("../../../assets/img/temp4.png")}
                                  alt="Upload Image ........"
                                />
                              </div>
                              <div class="form-check">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  value=""
                                  onClick={() => {
                                    setTemplate(5);
                                  }}
                                  id="flexCheckDefault5"
                                  name="tempRadio"
                                />
                                <label
                                  class="form-check-label"
                                  for="flexCheckDefault5">
                                  Select
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>

                        {(() => {
                          switch (template) {
                            case 1:
                              return (
                                <div className=" row border rounded p-2 mx-1">
                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Background Image (size:2480 x 3508){" "}
                                    </span>
                                    <label
                                      htmlFor="upload_video"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className={classNames(
                                        "form-control  border border-secondary px-4",
                                        { "is-invalid": errors.productImage }
                                      )}
                                      defaultValue=""
                                      name="productImage"
                                      capture
                                      {...register("productImage", {
                                        required: "Enter Product Name",
                                      })}
                                      // onChange={(e) => productImageSelection(e)}
                                    />
                                  </div>
                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      QR Image{" "}
                                    </span>
                                    <label
                                      htmlFor="upload_video"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className={classNames(
                                        "form-control  border border-secondary px-4",
                                        { "is-invalid": errors.productImage }
                                      )}
                                      defaultValue=""
                                      name="productImage"
                                      capture
                                      {...register("productImage", {
                                        required: "Enter Product Name",
                                      })}
                                      // onChange={(e) => productImageSelection(e)}
                                    />
                                  </div>
                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page Title
                                    </label>
                                    <input
                                      type="text"
                                      className={classNames(
                                        "form-control  border border-secondary signup_fields",
                                        { "is-invalid": errors.dba }
                                      )}
                                      name="dba"
                                      defaultValue={user?.dba}
                                      id="DBA"
                                      {...register("dba")}
                                    />
                                    {errors.dba && (
                                      <small className="errorText mx-1 fw-bold">
                                        {errors.dba?.message}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              );
                            case 2:
                              return (
                                <div>
                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Background Image{" "}
                                    </span>
                                    <label
                                      htmlFor="upload_video"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className={classNames(
                                        "form-control  border border-secondary px-4",
                                        { "is-invalid": errors.productImage }
                                      )}
                                      defaultValue=""
                                      name="productImage"
                                      capture
                                      {...register("productImage", {
                                        required: "Enter Product Name",
                                      })}
                                      // onChange={(e) => productImageSelection(e)}
                                    />
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page Title
                                    </label>
                                    <input
                                      type="text"
                                      className={classNames(
                                        "form-control  border border-secondary signup_fields",
                                        { "is-invalid": errors.dba }
                                      )}
                                      name="dba"
                                      defaultValue={user?.dba}
                                      id="DBA"
                                      {...register("dba")}
                                    />
                                    {errors.dba && (
                                      <small className="errorText mx-1 fw-bold">
                                        {errors.dba?.message}
                                      </small>
                                    )}
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page Footer Heading
                                    </label>
                                    <input
                                      type="text"
                                      className={classNames(
                                        "form-control  border border-secondary signup_fields",
                                        { "is-invalid": errors.dba }
                                      )}
                                      name="dba"
                                      defaultValue={user?.dba}
                                      id="DBA"
                                      {...register("dba")}
                                    />
                                    {errors.dba && (
                                      <small className="errorText mx-1 fw-bold">
                                        {errors.dba?.message}
                                      </small>
                                    )}
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label htmlFor="" className="fw-bold fs-6">
                                      Select Products from Inventory
                                    </label>
                                    <input
                                      type="text"
                                      className={classNames(
                                        "form-control  border border-secondary  signup_fields",
                                        { "is-invalid": errors.email }
                                      )}
                                      defaultValue={user?.companyName}
                                      name="companyName"
                                      id="name"
                                      {...register("companyName")}
                                    />
                                    {errors.companyName && (
                                      <small className="errorText mx-1 fw-bold">
                                        {errors.companyName?.message}
                                      </small>
                                    )}
                                  </div>
                                </div>
                              );
                            case 3:
                              return (
                                <div>
                                  <div className="form-group col-6 mb-4">
                                    <label htmlFor="" className="fw-bold fs-6">
                                      Company Address Line 2
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control"
                                      name="addressLine2"
                                      defaultValue={user?.addressLine2}
                                      id="addressLine2"
                                      {...register("addressLine2")}
                                    />
                                  </div>
                                </div>
                              );
                            default:
                              return null;
                          }
                        })()}

                        <div className="col-12 text-center">
                          <Button
                            loading={loader}
                            style={{
                              backgroundColor: "#eb3237",
                              fontSize: "20px",
                              position: "relative",
                              top: "-2px",
                            }}
                            appearance="primary"
                            className="comman_btn2 mx-2"
                            type="submit">
                            Submit
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button onClick={() => addFormFields()} className="comman_btn mt-2">
          + Add Page
        </button>
      </div>
    </div>
  );
};

export default CreateCatalog;
