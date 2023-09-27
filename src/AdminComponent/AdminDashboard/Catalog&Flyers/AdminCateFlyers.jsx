import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import Starlogo from "../../../assets/img/logo.png";
import axios from "axios";
import { useEffect } from "react";
import ProfileBar from "../ProfileBar";
import Swal from "sweetalert2";
import moment from "moment";
import Compressor from "compressorjs";

const AdminCateFlyers = () => {
  const [sideBar, setSideBar] = useState(true);
  const allPdf = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getCatalog`;
  const addCatelog = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/uploadCatlog`;
  const deleteCate = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/deleteCatalog`;
  const status = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/diableCatalog`;
  const [catelogueUrl, setCatelogueUrl] = useState("");
  const [catelogueTitle, setCatelogueTitle] = useState("");
  const [flyerUrl, setFlyerUrl] = useState("");
  const [flyerTitle, setFlyerTitle] = useState("");
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [fDate, setFdate] = useState();
  const [files, setFiles] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [flyers, setFlyers] = useState([]);

  useEffect(() => {
    getCatalogs();
    getFLyers();
  }, []);

  const getCatalogs = async () => {
    const { data } = await axios.post(allPdf, {
      type: "catalog",
    });
    console.log(data);
    if (!data.error) {
      setCatalogs(data?.results?.catalog);
    }
  };

  const onFileSelection = (e, key) => {
    let image = e.target.files[0];
    new Compressor(image, {
      success: (compressed) => {
        setFiles({ ...files, [key]: compressed });
      },
    });
  };

  const getFLyers = async () => {
    const { data } = await axios.post(allPdf, {
      type: "flyer",
    });
    console.log(data);
    if (!data.error) {
      setFlyers(data?.results?.catalog);
    }
  };

  // const onFileSelectionPdf = (e, key) => {
  //   setPdf({ ...pdf, [key]: e.target.files[0] });
  // };

  const AddCate = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("url", catelogueUrl);
    formData.append("title", catelogueTitle);
    formData.append("type", "catalog");
    formData.append("coverImage", files?.coverImageC);
    const { data } = await axios.post(addCatelog, formData);
    if (!data.error) {
      Swal.fire({
        title: "Catalog Uploaded Successfully!",
        icon: "success",
        timer: 2000,
      });
      document.getElementById("resetCatalog").click();
      setFiles([]);
      getCatalogs();
    } else {
      Swal.fire({
        title: data.message,
        icon: "error",
        timer: 2000,
      });
    }
  };
  const AddFlyer = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("url", flyerUrl);
    formData.append("title", flyerTitle);
    formData.append("type", "flyer");
    formData.append("flyerDate", fDate);
    formData.append("coverImage", files?.coverImageF);
    const { data } = await axios.post(addCatelog, formData);
    if (!data.error) {
      Swal.fire({
        title: "Flyer Uploaded Successfully!",
        icon: "success",
        timer: 2000,
      });
      setFiles([]);
      document.getElementById("resetFlyer").click();
      getFLyers();
    } else {
      Swal.fire({
        title: data.message,
        icon: "error",
        timer: 2000,
      });
    }
  };

  const deleteCatalog = async (type, id) => {
    const { data } = await axios.get(deleteCate + "/" + id);
    if (!data.error) {
      getCatalogs();
      getFLyers();
    }
  };

  const catalogStatus = async (id) => {
    await axios.get(status + "/" + id).then((res) => {
      if (!res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "success",
          confirmButtonText: "Okay",
          timer: 2000,
        });
      }
    });
  };

  const handleClick = () => {
    localStorage.removeItem("AdminData");
    localStorage.removeItem("AdminLogToken");
    localStorage.removeItem("AdminEmail");
  };

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
                      style={{ position: "relative", left: "4px", top: "2px" }}
                      className="fa fa-home"></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("User Management") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/UserManage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                      style={{ position: "relative", left: "6px", top: "3px" }}
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
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>

                <li
                  className={User?.access?.includes("Puller") ? "" : "d-none"}>
                  <Link
                    className=""
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
                    className="bg-white"
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                      style={{ position: "relative", left: "4px", top: "2px" }}
                      className="fa fa-home"></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/UserManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-user"></i>{" "}
                    User Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/CategorySub"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                      style={{ position: "relative", left: "6px", top: "3px" }}
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
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                    className="bg-white"
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                      style={{ position: "relative", left: "4px", top: "3px" }}
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
                      style={{ position: "relative", left: "4px", top: "3px" }}
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

        <div className="admin_panel_data height_adjust">
          <div className="row category_management justify-content-center">
            <div className="col-12">
              <div className="d-flex comman_header justify-content-between px-2">
                <div className="col-6">
                  <h2 className="main_headers fs-4">Catalogs</h2>
                </div>
                <div className="col-6  d-flex justify-content-end"></div>
              </div>
              <div className="row mx-0">
                <div className="col-12 design_outter_comman  shadow">
                  <div className="row">
                    <div className="col-12 user-management-tabs px-0">
                      <div className="">
                        <nav>
                          <div
                            className="nav nav-tabs"
                            id="nav-tab"
                            role="tablist">
                            <button
                              className="nav-link active"
                              id="nav-home-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-home"
                              type="button"
                              role="tab"
                              aria-controls="nav-home"
                              aria-selected="true">
                              Catalogs
                            </button>
                            <button
                              className="nav-link"
                              id="nav-profile-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-profile"
                              type="button"
                              role="tab"
                              aria-controls="nav-profile"
                              aria-selected="false">
                              Monthly Flyers
                            </button>
                          </div>
                        </nav>
                        <div
                          className="tab-content recent_orders_cate"
                          id="nav-tabContent">
                          <div
                            className="tab-pane fade show active"
                            id="nav-home"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab">
                            <div className="row mx-0 ">
                              <div className="col-12 pt-2">
                                <a
                                  className="text-decoration-none mt-2 pb-3"
                                  href="https://dcatalog.com/"
                                  target="_blank">
                                  Convert PDF to Flipbook.
                                </a>

                                <form
                                  className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                                  action="">
                                  <div className="form-group mb-0 col-4">
                                    <span>Enter Catalog Title</span>{" "}
                                    <label htmlFor="upload_video"></label>
                                    <input
                                      type="text"
                                      className="form-control shadow-none"
                                      defaultValue=""
                                      name="catelogue"
                                      onChange={(e) =>
                                        setCatelogueTitle(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="form-group mb-0 col-4 choose_fileAdmin position-relative">
                                    <span>Cover Image</span>{" "}
                                    <label htmlFor="upload_video">
                                      <i class="fa fa-camera me-1"></i>
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      className="form-control shadow-none"
                                      defaultValue=""
                                      accept="image/*"
                                      name="coverImage"
                                      onChange={(e) =>
                                        onFileSelection(e, "coverImageC")
                                      }
                                    />
                                  </div>
                                  <div className="form-group mb-0 col-4">
                                    <span>Enter Catalog Url</span>{" "}
                                    <label htmlFor="upload_video"></label>
                                    <input
                                      type="text"
                                      className="form-control shadow-none"
                                      defaultValue=""
                                      name="catelogue"
                                      onChange={(e) =>
                                        setCatelogueUrl(e.target.value)
                                      }
                                    />
                                  </div>

                                  <div className="form-group mb-0 col-12 text-center mt-4">
                                    <button
                                      className="comman_btn2"
                                      onClick={AddCate}>
                                      Save Catalog
                                    </button>
                                    <button
                                      className="comman_btn d-none"
                                      id="resetCatalog"
                                      type="reset">
                                      Reset
                                    </button>
                                  </div>
                                </form>

                                <div className="row ">
                                  <div className="col-12 comman_table_design px-0">
                                    <div className="table-responsive border">
                                      <table className="table mb-0">
                                        <thead>
                                          <tr
                                            style={{
                                              backgroundColor: "#f2f2f2",
                                            }}>
                                            <th>Date</th>
                                            <th>Title</th>
                                            <th>Cover Image</th>
                                            <th>Url</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                          </tr>
                                        </thead>
                                        <tbody className="recent_orders_cate">
                                          {catalogs?.map((item, index) => (
                                            <tr>
                                              <td className="border">
                                                {" "}
                                                {moment(item?.updatedAt).format(
                                                  "MM/DD/YYYY"
                                                )}
                                              </td>
                                              <td className="border">
                                                {item?.title}
                                              </td>
                                              <td className="border">
                                                {item?.url}
                                              </td>
                                              <td className="border">
                                                <img
                                                  className="subCatImages"
                                                  src={
                                                    item?.coverImage
                                                      ? item?.coverImage
                                                      : require("../../../assets/img/product.jpg")
                                                  }
                                                ></img>
                                              </td>

                                              <td className="border">
                                                {" "}
                                                <div
                                                  className=""
                                                  //   key={item?._id}
                                                >
                                                  <label class="switchUser">
                                                    <input
                                                      type="checkbox"
                                                      id={item?._id}
                                                      defaultChecked={
                                                        item?.status
                                                      }
                                                      onClick={() => {
                                                        catalogStatus(
                                                          item?._id
                                                        );
                                                      }}
                                                    />
                                                    <span class="sliderUser round"></span>
                                                  </label>
                                                </div>
                                              </td>
                                              <td className="border">
                                                <a
                                                  className="comman_btn2 text-white text-decoration-none"
                                                  onClick={() => {
                                                    deleteCatalog(
                                                      "catalog",
                                                      item?._id
                                                    );
                                                  }}>
                                                  Delete
                                                </a>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="tab-pane fade recent_order"
                            id="nav-profile"
                            role="tabpanel"
                            aria-labelledby="nav-profile-tab">
                            <div className="row mx-0 ">
                              <div className="col-12 pt-2">
                                <a
                                  className="text-decoration-none mt-2 pb-3"
                                  href="https://dcatalog.com/"
                                  target="_blank">
                                  Convert PDF to Flipbook.
                                </a>

                                <form
                                  className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                                  action="">
                                  <div className="form-group mb-0 col-3">
                                    <span>Flyer Title</span>{" "}
                                    <input
                                      type="text"
                                      className="form-control shadow-none"
                                      defaultValue=""
                                      name="flyerTitle"
                                      onChange={(e) =>
                                        setFlyerTitle(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="form-group mb-0 col-3 choose_fileAdmin position-relative">
                                    <span>Cover Image</span>{" "}
                                    <label htmlFor="upload_video">
                                      <i class="fa fa-camera me-1"></i>
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      className="form-control shadow-none"
                                      defaultValue=""
                                      accept="image/*"
                                      name="coverImage"
                                      onChange={(e) =>
                                        onFileSelection(e, "coverImageF")
                                      }
                                    />
                                  </div>
                                  <div className="form-group mb-0 col-3">
                                    <span>Upload Flyer Url</span>{" "}
                                    <input
                                      type="text"
                                      className="form-control shadow-none"
                                      defaultValue=""
                                      name="flyer"
                                      onChange={(e) =>
                                        setFlyerUrl(e.target.value)
                                      }
                                    />
                                  </div>
                                  <div className="form-group mb-0 col-3">
                                    <label htmlFor="">Choose Date </label>
                                    <input
                                      type="date"
                                      className="form-control"
                                      id="dateF"
                                      name="expiry"
                                      value={fDate}
                                      onChange={(e) =>
                                        setFdate(e.target.value)
                                      }></input>
                                  </div>

                                  <div className="form-group mb-0 col-12 text-center mt-4">
                                    <button
                                      className="comman_btn2"
                                      onClick={AddFlyer}>
                                      Save Flyer
                                    </button>
                                    <button
                                      className="comman_btn d-none"
                                      id="resetFlyer"
                                      type="reset">
                                      Reset
                                    </button>
                                  </div>
                                </form>

                                <div className="row ">
                                  <div className="col-12 comman_table_design px-0">
                                    <div className="table-responsive border">
                                      <table className="table mb-0">
                                        <thead>
                                          <tr
                                            style={{
                                              backgroundColor: "#f2f2f2",
                                            }}>
                                            <th>Date</th>
                                            <th>Title</th>
                                            <th>Cover Image</th>
                                            <th>Url</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                          </tr>
                                        </thead>
                                        <tbody className="recent_orders_cate">
                                          {flyers?.map((item, index) => (
                                            <tr>
                                              <td className="border">
                                                {moment(item?.updatedAt).format(
                                                  "MM/DD/YYYY"
                                                )}
                                              </td>
                                              <td className="border">
                                                {item?.title}
                                              </td>
                                              <td className="border">
                                                <img
                                                  className="subCatImages"
                                                  src={
                                                    item?.coverImage
                                                      ? item?.coverImage
                                                      : require("../../../assets/img/product.jpg")
                                                  }
                                                ></img>
                                              </td>
                                              <td className="border">
                                                {item?.url}
                                              </td>

                                              <td className="border">
                                                {" "}
                                                <div
                                                  className=""
                                                  key={item?._id}>
                                                  <label class="switchUser">
                                                    <input
                                                      type="checkbox"
                                                      id={item?._id}
                                                      defaultChecked={
                                                        item?.status
                                                      }
                                                      onClick={() => {
                                                        catalogStatus(
                                                          item?._id
                                                        );
                                                      }}
                                                    />
                                                    <span class="sliderUser round"></span>
                                                  </label>
                                                </div>
                                              </td>
                                              <td className="border">
                                                <a
                                                  className="comman_btn2 text-white text-decoration-none"
                                                  onClick={() => {
                                                    deleteCatalog(
                                                      "catalog",
                                                      item?._id
                                                    );
                                                  }}>
                                                  Delete
                                                </a>
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <></>
    </div>
  );
};

export default AdminCateFlyers;
