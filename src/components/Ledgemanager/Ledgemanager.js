import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";
import {Link} from "react-router-dom";
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
                name: null,
                address: null,
                managers: null,
                status: null,
            },

            currentSite_id: null,
            currentSite_name: null,
            currentSite_address: null,
            currentSite_managers: null,

            updateModal: false,
            viewModal: false,
        };
    }

    refresh() {
        window.location.reload(false);
    }

    onChangeSiteAddress(e) {
        let newSite = this.state.newSite;
        newSite.address = e.target.value;
        this.setState({ newSite: newSite });
    }

    onChangeSiteName(e) {
        let newSite = this.state.newSite;
        newSite.name = e.target.value;
        this.setState({ newSite: newSite });
    }

    onChangeSiteManagers(e) {
        let newSite = this.state.newSite;
        newSite.managers = e.target.value;
        this.setState({ newSite: newSite });
    }

    submitSiteDelete(id) {
        let url = BASE_URL;
        const query = `UPDATE employees SET status = -1 where id = ${id};`;

        let data = { crossDomain: true, crossOrigin: true, query: query };
        axios
            .post(url, data)
            .then((res) => {
                console.log(res.data);
                toast("site deleted successfully!");
                setTimeout(this.refresh, 4000);
            })
            .catch((error) => {
                console.log(error);
            });

        this.setState({ name: "", email: "", mobileNo: "" });
    }

    fetchSitesData() {
        let url = BASE_URL;
        const query = `SELECT * FROM employees where status = 1;`;
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
                    <td>{site.name}</td>
                    <td>{site.address}</td>
                    <td>{site.managers}</td>
                    
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
                                    currentSite_id: site.id,
                                    currentSite_name: site.name,
                                    currentSite_address: site.address,
                                    currentSite_managers: site.managers,
                                    viewModal: true,
                                });
                            }}
                        >
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-primary btn-sm mx-1">
                            <i class="fas fa-paperclip"></i>
                        </button>
                        <button
                            class="btn btn-primary btn-sm mx-1"
                            onClick={(e) => {
                                this.setState({
                                    currentSite_id: site.id,
                                    currentSite_name: site.name,
                                    currentSite_address: site.address,
                                    currentSite_managers: site.managers,
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
                                       

                                        <table
                                            id="sitesTable"
                                            className="table table-bordered table-striped"
                                        >
                                            <thead>
                                                <tr>
                                                    <th>id</th>
                                                    <th>Name</th>
                                                    <th>Address</th>

                                                    <th>Managers</th>
                                                    <th>Status</th>
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
                    
                </div>
                {/* /.content-wrapper */}
            </div>
        );
    }
}
