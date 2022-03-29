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

export default class Users extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sites: null,

            newSite: {
                project_id: null,
                project_name: null,
                project_desc: null,

            },
            
            
               
            currentSite_pname:null,
            currentSite_pdesc:null,
            currentSite_pid:null,

          

            updateModal: false,
            viewModal: false,
        };
    }

    refresh() {
        window.location.reload(false);
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
            'INSERT INTO projects (project_name, project_desc) values("' +
            this.state.newSite.project_name +
            '", "' +
            this.state.newSite.project_desc +
            '") ';

        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log(res.data);
                toast("new user added!");
                setTimeout(this.refresh, 1000);
            })
            .catch((error) => {
                console.log(error);
            });
    }

    submitSiteUpdate(e) {
        let url = BASE_URL;
        const query =
            'UPDATE projects SET project_name="' +
            this.state.currentSite_pname +
            '", project_desc="' +
            this.state.currentSite_pdesc +
            '" WHERE project_id=' +
            this.state.currentSite_pid +
            "";


        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log(res.data);
                toast("project updated successfully!");
                setTimeout(this.refresh, 1000);
            })
            .catch((error) => {
                console.log(error);
            });

        this.setState({ project_name: "", project_desc: "" });
    }

    submitSiteDelete(project_id) {
        let url = BASE_URL;
        const query = ` DELETE FROM projects WHERE project_id = ${project_id};`;

        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log(res.data);
                toast("project deleted successfully!");
                setTimeout(this.refresh, 1000);
            })
            .catch((error) => {
                console.log(error);
            });

        this.setState({ project_name: "", project_desc: "" });
    }

    fetchSitesData() {
        let url = BASE_URL;
        const query = `SELECT * from projects`;
        let data = { crossDomain: true, crossOrigin: true, query: query };

        axios
            .post(url, data)
            .then((res) => {
                console.log("projects data: ", res.data);
                this.setState({ sites: res.data });
            })
            .catch((err) => {
                console.log("projects data error: ", err);
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
                    <td>{site.project_id}</td>
                    <td>{site.project_name}</td>
                    <td>{site.project_desc}</td>
                    <td>
                        <span class="badge bg-success">
                            {site.status === 1 ? "active" : "inactive"}
                        </span>
                    </td>
                    <td className="">
                        <button
                            class="btn btn-primary btn-sm mx-1"
                            onClick={() => {
                                this.setState({
                                    currentSite_pid: site.project_id,
                                    currentSite_pdesc:site.project_desc,
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
                                    currentSite_pid: site.project_id,
                                    currentSite_pdesc:site.project_desc,
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
                                    this.submitSiteDelete(site.project_id);
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
                                Project Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                id="siteName"
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
                                htmlFor="siteDesignation"
                                className="col-form-label"
                            >
                                Project Info
                            </label>
                            <textarea
                                className="form-control"
                                name="designation"
                                value={this.state.currentSite_pdesc}
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_pdesc: e.target.value,
                                    });
                                }}
                                id="siteDesignation"
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
                                Project Name:
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                id="siteName"
                                value={this.state.currentSite_pname}
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_pname: e.target.value,
                                    });
                                }}
                            />
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="siteDesignation"
                                className="col-form-label"
                            >
                                Project Info:
                            </label>
                            <textarea
                                className="form-control"
                                name="designation"
                                value={this.state.currentSite_pdesc}
                                onChange={(e) => {
                                    this.setState({
                                        currentSite_pdesc: e.target.value,
                                    });
                                }}
                                id="siteDesignation"
                                defaultValue={""}
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
                                                &nbsp;Add New Project
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
                                                                Add New Project
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
                                                                        Project Name:
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="name"
                                                                        className="form-control"
                                                                        id="siteName"
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
                                                                        htmlFor="siteDesignation"
                                                                        className="col-form-label"
                                                                    >
                                                                        Project Info:
                                                                    </label>
                                                                    <input
                                                                        type="text"
                                                                        name="designation"
                                                                        className="form-control"
                                                                        id="siteDesignation"
                                                                        
                                                                        onChange={(
                                                                            e
                                                                        ) => {
                                                                            this.onChangeProjectDesc(
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
                                                    <th>Project Name</th>
                                                    <th>Project Info</th>
                                                    
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
