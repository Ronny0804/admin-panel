import React from 'react';
import './Login.css';
class Login extends React.Component{
  constructor(){
    super();
    this.setState = {
      err:''
    }
  }
  login(e){
    e.preventDefault();
    var username : e.target.elements.email;
    var password : e.target.elements.password;
    if(username=='admin' && password=='admin'){
      this.props.history.push('/sites');
    }else{
      this.setState({
        err:'Invalid'
      })
    }
  }
    return (
        <div>
  <div className="hold-transition login-page">
    <div className="login-box">
      <div className="login-logo">
        <a href="../../index2.html"><b>Umika Asso.</b></a>
      </div>
      {/* /.login-logo */}
      <div className="card">
        <div className="card-body login-card-body">
          
          <form action="../../index3.html" method="post" className="mt-5" onsubmit={this.login.bind(this)}>
            <div className="input-group  mt-3">
              <input type="email" name="email" placeholder=""className="form-control" placeholder="Email" />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope" />
                </div>
              </div>
            </div>
            <div className="input-group mb-3 mt-3">
              <input type="password" name="password" className="form-control" placeholder="Password" />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <div className="icheck-primary mt-3">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember ">
                    Remember Me
                  </label>
                </div>
              </div>
              <p class="col-12 mb-1 ">
        <a href="forgot-password.html" className="forgot mx-auto my-2">I forgot my password</a>
      </p>
              {/* /.col */}
              <div className="col-12 signin">
              <button type="submit" class="btn btn-primary sign">Sign In</button>
              </div>
              {/* /.col */}
            </div>
          </form>
          
          {/* /.social-auth-links */}
          
        </div>
        {/* /.login-card-body */}
      </div>
    </div>
  </div>
  </div>
  )


}

export default Login;
