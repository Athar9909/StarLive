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
import Select from "react-select";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, FreeMode, Grid } from "swiper";
import "swiper/css";
import Temp1 from "./Temp1";

const CreateCatalog = () => {
  const getProducts = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/singleProduct`;
  const inventorySearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/searchInventory`;
  const [product, setProducts] = useState({});
  const [template, setTemplate] = useState(1);
  const [formValues, setFormValues] = useState([
    {
      page: [],
      images: [],
      staticImages: [],
      Banners: [],
      Headers: [],
      flavours: [],
    },
  ]);
  const [options, setOptions] = useState([]);
  const [flavours, setFlavours] = useState([]);
  const [searchKey, setSearchKey] = useState("");

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

  useEffect(() => {
    createOptions();
  }, [searchKey]);

  const createOptions = async () => {
    await axios
      .post(inventorySearch, {
        search: searchKey,
      })
      .then((res) => {
        if (!res.error) {
          let data = res?.data.results.results;
          // setProducts(data);
          const optionList = data?.map((item, index) => ({
            value: item?._id,
            label: item?.unitName,
          }));
          setOptions(optionList);
        }
      });
  };

  let handleChangeFlavour = (e, i) => {
    let val = e.target.value;
    let newFormValues = [...formValues];
    newFormValues[i].flavours = val;
    setFormValues(newFormValues);
  };

  const GetProducts = async (id) => {
    await axios.get(getProducts + "/" + id).then((res) => {
      let data = res?.data.results;
      setProducts((p) => ({ ...p, [id]: data }));
      const optionList = data?.type.map((item, index) => ({
        value: item?._id,
        label: item?.flavour,
      }));
      console.log(optionList, "kkl");
      setFlavours(optionList);
    });
  };

  console.log(formValues);
  const handleChange2 = (selected, index) => {
    GetProducts(selected?.value);
    let newFormValues = [...formValues];
    newFormValues[index].productName = selected;
    setFormValues(newFormValues);
  };

  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
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
        <div className="col-12 ">
          <button onClick={() => addFormFields()} className="comman_btn ">
            + Add Page
          </button>
          <button
            onClick={() => navigate("/Catelog-Flyers/Preview-Catalog")}
            className="comman_btn mx-2">
            Preview Catelogue
          </button>
        </div>
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
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop"
                        className="comman_btn mx-2">
                        Preview Template
                      </button>
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
                      <form className="row py-2 form-design" autoComplete="off">
                        <label className="fw-bold fs-6 mb-2">
                          Page Templates : Choose one
                        </label>

                        <div className="row text-start mb-4">
                          <Swiper
                            slidesPerView={4}
                            spaceBetween={30}
                            navigation={true}
                            loop={true}
                            modules={[
                              FreeMode,
                              Pagination,
                              Autoplay,
                              Navigation,
                            ]}
                            className="mySwiper px-5 py-2">
                            <SwiperSlide key={index}>
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
                                      Intro Page
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                            <SwiperSlide key={index}>
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
                                      Product Listing Page
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                            <SwiperSlide key={index}>
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
                                      Banner Display
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                            <SwiperSlide key={index}>
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
                                      Product Details
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                            <SwiperSlide key={index}>
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
                                      Summary Page
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                            <SwiperSlide key={index}>
                              <div className="form-group col-auto">
                                <div className=" position-relative d-inline-block">
                                  <div className="mb-2 ">
                                    <img
                                      className="Template_img"
                                      src={require("../../../assets/img/product.jpg")}
                                      alt="Upload Image ........"
                                    />
                                  </div>
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      value=""
                                      onClick={() => {
                                        setTemplate(6);
                                      }}
                                      id="flexCheckDefault6"
                                      name="tempRadio"
                                    />
                                    <label
                                      class="form-check-label"
                                      for="flexCheckDefault6">
                                      Image Only
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          </Swiper>
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

                                  <div className="form-group col-8 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Select Products (25 Products)
                                    </span>
                                    <Select
                                      name="users"
                                      options={options}
                                      value={item?.productName || ""}
                                      className="basic-multi-select z-3"
                                      classNamePrefix="select"
                                      onChange={(value) =>
                                        handleChange2(value, index)
                                      }
                                      onInputChange={handleInputChange}
                                      isClearable
                                      required
                                      isMulti
                                      placeholder="Type any keyword to Search Product"
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
                                      Page Footer
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
                            case 3:
                              return (
                                <div className=" row border rounded p-2 mx-1">
                                  <div className="form-group col-6 choose_fileInvent position-relative mt-2">
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
                                  <div className="form-group col-6 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Uplaod Banners (3 Banners)
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
                                      multiple
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
                                      Banner 1 Url
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
                                      Banner 2 Url
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
                                      Banner 3 Url
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
                                      Page header
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
                                      Page Footer
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

                            case 4:
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
                                      Select Product
                                    </span>
                                    <Select
                                      name="users"
                                      options={options}
                                      value={item?.productName || ""}
                                      className="basic-multi-select z-3"
                                      classNamePrefix="select"
                                      onChange={(value) =>
                                        handleChange2(value, index)
                                      }
                                      onInputChange={handleInputChange}
                                      isClearable
                                      required
                                      placeholder="Type any keyword to Search Product"
                                    />
                                  </div>

                                  <div className="form-group col-4">
                                    <label htmlFor="">Select Flavour</label>
                                    <Select
                                      name="flavours"
                                      options={flavours}
                                      value={item?.flavours || ""}
                                      className="basic-multi-select z-3"
                                      classNamePrefix="select"
                                      onChange={(value) =>
                                        handleChangeFlavour(value, index)
                                      }
                                      isMulti
                                      isClearable
                                      required
                                      placeholder="Select 4 Flavours"
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
                                      Page Footer
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
                            case 5:
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
                                      Uplaod Video{" "}
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
                                      Video Url
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

                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Uplaod Banner Image 1{" "}
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
                                      Banner 1 Url
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

                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Uplaod Banner Image 2{" "}
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
                                      Banner 2 Url
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
                                      Page header
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
                                      Page Footer
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

                            case 6:
                              return (
                                <div className=" row border rounded p-2 mx-1">
                                  <div className="form-group col-6 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Page Image (size:2480 x 3508){" "}
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

                                  <div className="form-group col-6 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page Url
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

                            default:
                              return null;
                          }
                        })()}

                        <div className="col-12 text-center mt-3">
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
      </div>

      <div
        className="modal fade comman_modal"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Selected Template
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="cateModal"
                aria-label="Close"
              />
            </div>

            <div className="modal-body shadow">
              <div>
                <Temp1 />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateCatalog;
