import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

//API handling components
import { BASE_URL } from "./../common/global.js";

// react toast
import { toast } from "react-toastify";

// datatablse packages
var $ = require("jquery");
$.DataTable = require("datatables.net");
require("datatables.net-bs4");
require("datatables.net-autofill-bs4");
require("datatables.net-buttons-bs4");
require("datatables.net-buttons/js/buttons.colVis");
require("datatables.net-buttons/js/buttons.flash");
require("datatables.net-buttons/js/buttons.html5");
require("datatables.net-buttons/js/buttons.print");
require("datatables.net-responsive-bs4");
require("datatables.net-scroller-bs4");
require("datatables.net-select-bs4");
require("pdfmake");

// Axios for HTTP req
const axios = require("axios");

export default class Sites extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sites: null,

            newSite: {
                first_name: null,
                email: null,
                phone: null,
                salary: null,
                status: '0',
                organization: null,
                designation: null,
                updated_at: null, 
                project_name: null,
                project_desc: null,

            },
            
            
               
            currentSite_pname:null,
            currentSite_pdesc:null,
            currentSite_pid:null,

            currentSite_id: null,
            currentSite_name: null,
            currentSite_email: null,
            currentSite_phone: null,
            currentSite_salary: null,
            currentSite_organization: null,
            currentSite_designation: null,

            updateModal: false,
            viewModal: false,
        };
    }

    refresh() {
        window.location.reload(false);
    }

    

    onChangeSiteName(e) {
        let newSite = this.state.newSite;
        newSite.first_name = e.target.value;
        this.setState({ newSite: newSite });
    }


    onChangeSiteEmail(e) {
        let newSite = this.state.newSite;
        newSite.email = e.target.value;
        this.setState({ newSite: newSite });
    }


    onChangeSitePhone(e) {
        let newSite = this.state.newSite;
        newSite.phone = e.target.value;
        this.setState({ newSite: newSite });
    }

    onChangeSiteSalary(e) {
        let newSite = this.state.newSite;
        newSite.salary = e.target.value;
        this.setState({ newSite: newSite });
    }
 

    onChangeSiteOrganization(e) {
        let newSite = this.state.newSite;
        newSite.organization = e.target.value;
        this.setState({ newSite: newSite });
    }


    onChangeSiteDesignation(e) {
        let newSite = this.state.newSite;
        newSite.designation = e.target.value;
        this.setState({ newSite: newSite });
    }


//project on change method
    onChangeProjectName(e) {
        let newSite = this.state.newSite;
        newSite.project_name = e.target.value;
        this.setState({ newSite: newSite });
    }

    onChangeProjectDesc(e) {
        let newSite = this.state.newSite;
        newSite.project_desc = e.target.value;
        this.setState({ newSite: newSite });
    }


    submitNewSite(e) {
        let url = BASE_URL;
        const query =
            'INSERT INTO employees (first_name, email, phone, salary,organization,designation) values("' +
            this.state.newSite.first_name +
            '", "' +
            this.state.newSite.email +
            '","' +
            this.state.newSite.phone +
            '","' +
            this.state.newSite.salary +
            '","' +
            this.state.newSite.organization +
            '", "' +
            this.state.newSite.designation +
            '") ';

        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log(res.data);
                toast("new user added!");
                setTimeout(this.refresh, 4000);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    submitSiteUpdate(e) {
        let url = BASE_URL;
        const query =
            'UPDATE employees SET first_name="' +
            this.state.currentSite_name +
            '", email="' +
            this.state.currentSite_email +
            '", designation="' +
            this.state.currentSite_designation +
            '",organization="' +
            this.state.currentSite_organization +
            '", phone="' +
            this.state.currentSite_phone +
            '", salary="' +
            this.state.currentSite_salary +
            '" WHERE id=' +
            this.state.currentSite_id +
            "";


        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log(res.data);
                toast("user updated successfully!");
                setTimeout(this.refresh, 4000);
            })
            .catch((error) => {
                console.log(error);
            });

        this.setState({ first_name: "", email: "", phone:"", designation: "", organization:"", salary: "" });
    }

    submitSiteDelete(id) {
        let url = BASE_URL;
        const query = ` DELETE FROM employees WHERE id = ${id};`;

        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log(res.data);
                toast("user deleted successfully!");
                setTimeout(this.refresh, 4000);
            })
            .catch((error) => {
                console.log(error);
            });

        this.setState({ first_name: "", email: "", phone:"", designation: "", organization:"", salary: "" });
    }

    fetchSitesData() {
        let url = BASE_URL;
        const query = `SELECT employees.id,employees.first_name, employees.email,employees.phone,employees.salary,employees.designation,employees.organization,projects.project_name
        FROM employees
         JOIN projects ON employees.id=projects.project_id;`;
        let data = { crossDomain: true, crossOrigin: true, query: query };

        axios
            .post(url, data)
            .then((res) => {
                console.log("sites data: ", res.data);
                this.setState({ sites: res.data });
            })
            .catch((err) => {
                console.log("sites data error: ", err);
            });
    }

 

    componentDidMount() {
        this.fetchSitesData();
       
    }

    componentDidUpdate() {
        $(function () {
            $("#sitesTable")
                .DataTable({
                    destroy: true,
                    responsive: true,
                    lengthChange: false,
                    autoWidth: false,
                    buttons: ["copy", "csv", "excel", "pdf", "print"],
                })
                .buttons()
                .container()
                .appendTo("#sitesTable_wrapper .col-md-6:eq(0)");
        });
    }

    renderSitesData() {
        const sites = this.state.sites;

        if (sites == null) {
            return null;
        }

        return sites.map((site) => {
            return (
                <tr>
                    <td>{site.id}</td>
                    <td>{site.first_name}</td>
                    <td>{site.email}</td>
                    <td>{site.organization}</td>
                    <td>{site.designation}</td>
                    <td>{site.phone}</td>
                    <td>{site.project_name}</td>
                    <td>
                        <span class="badge bg-success">
                            active
                        </span>
                    </td>
                    <td className="">
                        <button
                            class="btn btn-primary btn-sm mx-1"
                            onClick={() => {
                                this.setState({
                                    currentSite_id: site.id,
                                    currentSite_name: site.first_name,
                                    currentSite_address: site.designation,
                                    currentSite_managers: site.salary,
                                    currentSite_pname:site.project_name,
                                    viewModal: true,
                                });
                            }}
                        >
                            <i class="fas fa-eye"></i>
                        </button>
                        
                        <button
                            class="btn btn-primary btn-sm mx-1"
                            onClick={(e) => {
                                this.setState({
                                    currentSite_id: site.id,
                                    currentSite_name: site.first_name,
                                    currentSite_designation: site.designation,
                                    currentSite_salary: site.salary,
                                    currentSite_pname:site.project_name,
                                    updateModal: true,
                                });
                            }}
                        >
                            <i class="fas fa-user-edit"></i>
                        </button>

                        <button
                            class="btn btn-danger btn-sm mx-1"
                            onClick={(e) => {
                                if (
                                    window.confirm(
                                        "Really want to delete site?"
                                    )
                                ) {
                                    this.submitSiteDelete(site.id);
                                }
                            }}
                        >
                            <i class="fas fa-trash-alt"></i>
                        </button>
                       
                    </td>
                </tr>
            );
        });
    }

    renderViewModal() {
        return (
            <Modal
                show={this.state.viewModal}
                onHide={() => {
                    this.setState({ viewModal: false });
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>View Site</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label
                                htmlFor="siteName"
                                className="col-form-label"
                            >
                                Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                id="siteName"
                                value={this.state.currentSite_name}
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_name: e.target.value,
                                    });
                                }}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="siteDesignation"
                                className="col-form-label"
                            >
                                Designation:
                            </label>
                            <textarea
                                className="form-control"
                                name="designation"
                                value={this.state.currentSite_designation}
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_designation: e.target.value,
                                    });
                                }}
                                id="siteDesignation"
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="projectName"
                                className="col-form-label"
                            >
                                Project Name:
                            </label>
                            <input
                                type="text"
                                name="projectname"
                                className="form-control"
                                id="projectName"
                                value={this.state.currentSite_pname}
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_pname: e.target.value,
                                    });
                                }}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="siteSalary"
                                className="col-form-label"
                            >
                                Salary:
                            </label>
                            <input
                                type="number"
                                name="salary"
                                value={this.state.currentSite_salary}
                                className="form-control"
                                id="siteSalary"
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_salary: e.target.value,
                                    });
                                }}
                                readOnly
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            this.setState({ viewModal: false });
                        }}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    renderUpdateModal() {
        return (
            <Modal
                show={this.state.updateModal}
                onHide={() => {
                    this.setState({ updateModal: false });
                }}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Update User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label
                                htmlFor="siteName"
                                className="col-form-label"
                            >
                                Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                id="siteName"
                                value={this.state.currentSite_name}
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_name: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="siteDesignation"
                                className="col-form-label"
                            >
                                Designation:
                            </label>
                            <textarea
                                className="form-control"
                                name="designation"
                                value={this.state.currentSite_designation}
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_designation: e.target.value,
                                    });
                                }}
                                id="siteDesignation"
                                defaultValue={""}
                            />
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="projectName"
                                className="col-form-label"
                            >
                                Project Name:
                            </label>
                            <textarea
                                className="form-control"
                                name="designation"
                                value={this.state.currentSite_pname}
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_pname: e.target.value,
                                    });
                                }}
                                id="projectName"
                                defaultValue={""}
                            />
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="siteSalary"
                                className="col-form-label"
                            >
                                Salary:
                            </label>
                            <input
                                type="number"
                                name="salary"
                                value={this.state.currentSite_salary}
                                className="form-control"
                                id="siteSalary"
                               
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_salary: e.target.value,
                                    });
                                }}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            this.setState({ updateModal: false });
                        }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="primary"
                        onClick={(e) => {
                            this.submitSiteUpdate(e);
                            this.setState({ updateModal: false });
                        }}
                    >
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    render() {
        return (
            <div>
                {/* Content Wrapper. Contains page content */}
                <div className="content-wrapper">
                    {/* Main content */}
                    <section className="content">
                        <div className="container-fluid">
                            <div className="row">
                                <div className="col-12">
                                    <div class="mt-2">
                                        {/* add new site modal */}
                                        <div className="add">
                                            <button
                                                type="button"
                                                class=" new btn btn-primary btn-sm mb-2"
                                                data-toggle="modal"
                                                data-target="#exampleModal"
                                                data-whatever="@mdo"
                                            >
                                                <span>
                                                    <i class="fas fa-user-plus"></i>
                                                </span>
                                                &nbsp;Add New User
                                            </button>
                                            <div
                                                className="modal fade"
                                                id="exampleModal"
                                                tabIndex={-1}
                                                role="dialog"
                                                aria-labelledby="exampleModalLabel"
                                                aria-hidden="true"
                                            >
                                                <div
                                                    className="modal-dialog"
                                                    role="document"
                                                >
                                                    <div className="modal-content">
                                                        <div className="modal-header">
                                                            <h5
                                                                className="modal-title"
                                                                id="exampleModalLabel"
                                                            >
                                                                Add New User
                                                            </h5>
                                                            <button
                                                                type="button"
                                                                className="close "
                                                                data-dismiss="modal"
                                                                aria-label="Close"
                                                            >
                                                                <span aria-hidden="true">
                                                                    ×
                                                                </span>
                                                            </button>
                                                        </div>
                                                        <div className="modal-body">
                                                            <form>
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="siteName"
                                                                        className="col-form-label"
                                                                    >
                                                                        Name:
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        className="form-control"
                                                                        id="siteName"
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onChangeSiteName(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="siteEmail"
                                                                        className="col-form-label"
                                                                    >
                                                                        Email:
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="email"
                                                                        className="form-control"
                                                                        id="siteEmail"
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onChangeSiteEmail(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="sitePhone"
                                                                        className="col-form-label"
                                                                    >
                                                                        Phone:
                                                                    </label>
                                                                    <input
                                                                        type="phone"
                                                                        name="phone"
                                                                        className="form-control"
                                                                        id="sitePhone"
                                                                       
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onChangeSitePhone(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="siteDesignation"
                                                                        className="col-form-label"
                                                                    >
                                                                        Designation:
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="designation"
                                                                        className="form-control"
                                                                        id="siteDesignation"
                                                                        
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onChangeSiteDesignation(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="projectName"
                                                                        className="col-form-label"
                                                                    >
                                                                        Project Name:
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="projectname"
                                                                        className="form-control"
                                                                        id="projectName"
                                                                        
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onChangeProjectName(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="siteOrganization"
                                                                        className="col-form-label"
                                                                    >
                                                                        Organization:
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="organization"
                                                                        className="form-control"
                                                                        id="siteOrganization"
                                                                        
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onChangeSiteOrganization(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                                <div className="form-group">
                                                                    <label
                                                                        htmlFor="siteSalary"
                                                                        className="col-form-label"
                                                                    >
                                                                        Salary:
                                                                    </label>
                                                                    <input
                                                                        type="number"
                                                                        name="salary"
                                                                        className="form-control"
                                                                        id="siteSalary"
                                                                        
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onChangeSiteSalary(
                                                                                e
                                                                            );
                                                                        }}
                                                                    />
                                                                </div>
                                                            </form>
                                                        </div>
                                                        <div className="modal-footer">
                                                            <button
                                                                type="button"
                                                                className="btn btn-secondary"
                                                                data-dismiss="modal"
                                                            >
                                                                Close
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn btn-primary"
                                                                onClick={(
                                                                    e
                                                                ) => {
                                                                    this.submitNewSite(
                                                                        e
                                                                    );
                                                                }}
                                                            >
                                                                Submit
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <table
                                            id="sitesTable"
                                            className="table table-bordered table-striped"
                                        >
                                            <thead>
                                                <tr>
                                                    <th>id</th>
                                                    <th>Name</th>
                                                    <th>Email</th>
                                                    <th>organization</th>
                                                    <th>designation</th>
                                                    <th>salary</th>
                                                    <th>updated_at</th>
                                                    <th>status</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.renderSitesData()}
                                                <div
                                                    className="modal fade"
                                                    id="update"
                                                    tabIndex={-1}
                                                    role="dialog"
                                                    aria-labelledby="exampleModalLabel"
                                                    aria-hidden="true"
                                                >
                                                    <div
                                                        className="modal-dialog"
                                                        role="document"
                                                    >
                                                        <div className="modal-content">
                                                            <div className="modal-header">
                                                                <h5
                                                                    className="modal-title"
                                                                    id="exampleModalLabel"
                                                                >
                                                                    New message
                                                                </h5>
                                                                <button
                                                                    type="button"
                                                                    className="close"
                                                                    data-dismiss="modal"
                                                                    aria-label="Close"
                                                                >
                                                                    <span aria-hidden="true">
                                                                        ×
                                                                    </span>
                                                                </button>
                                                            </div>
                                                            <div className="modal-body">
                                                                <form>
                                                                    <div className="form-group">
                                                                        <label
                                                                            htmlFor="recipient-name"
                                                                            className="col-form-label"
                                                                        >
                                                                            Recipient:
                                                                        </label>
                                                                        <input
                                                                            type="text"
                                                                            className="form-control"
                                                                            id="recipient-name"
                                                                        />
                                                                    </div>
                                                                    <div className="form-group">
                                                                        <label
                                                                            htmlFor="message-text"
                                                                            className="col-form-label"
                                                                        >
                                                                            Message:
                                                                        </label>
                                                                        <textarea
                                                                            className="form-control"
                                                                            id="message-text"
                                                                            defaultValue={
                                                                                ""
                                                                            }
                                                                        />
                                                                    </div>
                                                                </form>
                                                            </div>
                                                            <div className="modal-footer">
                                                                <button
                                                                    type="button"
                                                                    className="btn btn-secondary"
                                                                    data-dismiss="modal"
                                                                >
                                                                    Close
                                                                </button>
                                                                <button
                                                                    type="submit"
                                                                    className="btn btn-primary"
                                                                >
                                                                    update
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                {/* /.col */}
                            </div>
                            {/* /.row */}
                        </div>
                        {/* /.container-fluid */}
                    </section>
                    {/* /.content */}
                    {this.renderViewModal()}
                    {this.renderUpdateModal()}
                </div>
                {/* /.content-wrapper */}
            </div>
        );
    }
}
