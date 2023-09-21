import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { Button } from "rsuite";

const ViewPuller = () => {
  const [sideBar, setSideBar] = useState(true);
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [pullerId, setPullerId] = useState();
  const getPullerApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getPuller`;
  const editPuller = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/editPuller`;
  const [pullerDetails, setPullerDetails] = useState([]);
  const [files, setFiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  let { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFileSelection = (e, key) => {
    let image = e.target.files[0];
    setFiles({ ...files, [key]: image });
  };

  useEffect(() => {
    getPuller();
  }, []);

  const getPuller = async () => {
    await axios.get(getPullerApi + "/" + id).then((res) => {
      setPullerDetails(res?.data.results);
    });
  };

  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append("fullName", data?.puller_name?.trim());
    formData.append("email", data?.email?.trim());
    formData.append("password", data?.password?.trim());
    formData.append("image", files?.imageProfile);
    await axios
      .post(editPuller + "/" + id, formData)
      .then((res) => {
        if (res?.data?.message === "Puller updated") {
          getPuller();
          setFiles([]);
          navigate("/Puller-Management");
          Swal.fire({
            title: res?.data?.message,
            text: "Successfully Updated!",
            icon: "success",
            timer: 1000,
            confirmButtonText: "okay",
          });
        }
        if (res?.data?.error) {
          Swal.fire({
            title: res?.data.message,
            icon: "error",
            confirmButtonText: "okay",
          });
        }
      })
      .catch((err) => {
        if (err) {
          Swal.fire({
            title: err.response?.data?.message,
            text: "",
            icon: "error",
            confirmButtonText: "ok",
          });
        }
      });
  };

  document.getElementById("image_up")?.addEventListener("change", function () {
    if (this.files[0]) {
      var picture = new FileReader();
      picture.readAsDataURL(this.files[0]);
      picture.addEventListener("load", function (event) {
        document
          .getElementById("image")
          .setAttribute("src", event.target.result);
      });
    }
  });

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
                    style={{ textDecoration: "none", fontSize: "18px" }}>
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
                    className="bg-white"
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"></i>{" "}
                    Puller Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Gallery") ? "" : "d-none"
                  }>
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
                    style={{ textDecoration: "none", fontSize: "18px" }}>
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
                    className="bg-white"
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
          <div className="row inventory-management justify-content-center">
            <div className="col-12">
              <div className="row mx-0">
                <div className="col-12 design_outter_comman recent_orders shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2 className="main_headers">Puller Details</h2>
                    </div>
                    <div className="col-auto">
                      <div className="Status_box">
                        Status:{" "}
                        <strong>
                          {pullerDetails?.puller?.status
                            ? "Active"
                            : "In-active"}
                        </strong>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 p-4 Pending-view-main">
                      <form
                        className="row py-2 form-design"
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmit)}>
                        <div className="col-12 text-center mb-4">
                          <div className="form-group col-auto">
                            <div className="account_profile position-relative d-inline-block">
                              <div className="mb-2 Pending-view_img">
                                <img
                                  className="UserImage"
                                  id="image"
                                  src={pullerDetails?.puller?.image}
                                  alt="Upload Image ........"
                                />
                              </div>

                              <div className="p-image">
                                <i className="upload-iconIN fas fa-camera" />

                                <input
                                  className="file-uploadIN"
                                  id="image_up"
                                  type="file"
                                  name="imageProfile"
                                  accept="image/*"
                                  {...register("imageProfile")}
                                  onChange={(e) =>
                                    onFileSelection(e, "imageProfile")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-6 mb-4">
                          <label htmlFor="" className="fw-bold fs-6">
                            Puller Name
                          </label>
                          <input
                            type="text"
                            className={classNames(
                              "form-control  border border-secondary  signup_fields",
                              { "is-invalid": errors.puller_name }
                            )}
                            defaultValue={pullerDetails?.puller?.fullName}
                            name="puller_name"
                            id="name"
                            {...register("puller_name")}
                          />
                          {errors.puller_name && (
                            <small className="errorText mx-1 fw-bold">
                              {errors.puller_name?.message}
                            </small>
                          )}
                        </div>

                        <div className="form-group col-6 mb-4">
                          <label htmlFor="" className="fw-bold fs-6">
                            Email Address
                          </label>
                          <input
                            type="text"
                            className={classNames(
                              "form-control  border border-secondary signup_fields ",
                              { "is-invalid": errors.email }
                            )}
                            defaultValue={pullerDetails?.puller?.email}
                            name="email"
                            id="name"
                            {...register("email", {
                              pattern: {
                                value:
                                  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                                message: "Invalid email address",
                              },
                            })}
                          />
                          {errors.email && (
                            <small className="errorText mx-1 fw-bold">
                              {errors.email?.message}
                            </small>
                          )}
                        </div>
                        <div className="form-group col-6 mb-4">
                          <label htmlFor="" className="fw-bold fs-6">
                            Set New Password
                          </label>
                          <input
                            type="text"
                            className={classNames(
                              "form-control border border-secondary",
                              {
                                "is-invalid": errors.password,
                              }
                            )}
                            name="password"
                            placeholder="************"
                            {...register("password", {
                              maxLength: {
                                value: 15,
                                message: "Cannot be more than 15 Characters",
                              },
                              // pattern: {
                              //   value:
                              //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                              //   message:
                              //     "Password must be 8 characters including one uppercase letter, one special character and alphanumeric characters (ex:Starlove12@)",
                              // },
                            })}
                          />

                          {errors.password && (
                            <small className="errorText mx-1 fw-bold">
                              {errors.password?.message}
                            </small>
                          )}
                        </div>

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
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </div>
                    <div className="col-12 mb-4">
                      <div className="cart_table\s">
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr className="">
                                <th>ORDER ID</th>
                                <th>ORDER TYPE</th>
                                <th>ORDER DATE</th>
                                <th>PULL STATUS</th>
                                <th>ACTION</th>
                              </tr>
                            </thead>
                            <tbody className="border">
                              {(pullerDetails?.order || [])?.map(
                                (item, index) => (
                                  <tr className="border">
                                    <td className="border text-center">
                                      <div className="cart_content border text-center mt-2">
                                        {item?.orderId}
                                      </div>
                                    </td>
                                    <td className="border text-center">
                                      <div className="cart_content mt-2">
                                        <h3 className="fs-6">{item?.type}</h3>
                                      </div>
                                    </td>
                                    <td>
                                      <span className="ordertext my-2 d-block text-center ">
                                        Ordered On:{" "}
                                        {item?.createdAt?.slice(0, 10)}
                                      </span>
                                    </td>

                                    <td className="border rounded">
                                      {item?.scanned ? (
                                        <span className="fs-5  p-2 px-3 rounded">
                                          <img
                                            src={require("../../../assets/img/Group 427322975.png")}></img>
                                        </span>
                                      ) : (
                                        <span className="fs-5 text-secondary  p-2 px-3 rounded">
                                          Pending
                                        </span>
                                      )}
                                    </td>

                                    <td className="border text-center">
                                      <span className="fs-5 rounded ">
                                        <button
                                          className="comman_btn"
                                          onClick={() =>
                                            navigate(
                                              `/OrderRequest/ViewOrder/${item?._id}`
                                            )
                                          }>
                                          View
                                        </button>
                                      </span>
                                    </td>
                                  </tr>
                                )
                              )}
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
  );
};

export default ViewPuller;
