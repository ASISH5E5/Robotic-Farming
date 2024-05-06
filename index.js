const express = require('express');
const { Manager, Investor, requests ,works,workers} = require('./models');
const { connection } = require('./connect.js');




const app = express();
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const flash = require('connect-flash');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('ssh the secret thing'));
connection();
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

app.use(
  session({
    secret: 'my-secret-key-12345',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Passport configuration
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email, password, done) => {
    try {
      const manager = await Manager.findOne({ where: { email } });

      if (!manager || !(await bcrypt.compare(password, manager.password))) {
        return done(null, false, { message: 'Invalid credentials' });
      }
      console.log('Login Success ');
      return done(null, manager);
    } catch (err) {
      console.error('Error occurred during authentication', err);
      return done(err);
    }
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const manager = await Manager.findByPk(id);
    done(null, manager);
  } catch (err) {
    done(err);
  }
});
app.route('/alogin')
  .get((req, res) => {
    res.render('home', { manager: req.user, messages: req.flash() });
  })
  .post(passport.authenticate('local', {
    successFlash: true,
    failureFlash: true,
    failureRedirect: '/alogin',
  }), (req, res) => {
    const manager = req.user;

    if (!manager || !manager.id) {
      // Handle the case where manager or manager.id is not available
      req.flash('error', 'Invalid user');
      return res.status(401).redirect('/alogin');
    }

    console.log('Login Successfully');
    res.redirect(`/home?id=${manager.id}`);
  });

  app.route('/ilogin')
  .get((req, res) => {
    res.render('invest', { manager: req.user, messages: req.flash() });
  })
  .post(passport.authenticate('local', {
    successFlash: true,
    failureFlash: true,
    failureRedirect: '/ilogin',
  }), (req, res) => {
    const manager = req.user;

    if (!manager || !manager.id) {
      // Handle the case where manager or manager.id is not available
      req.flash('error', 'Invalid user');
      return res.status(401).redirect('/ilogin');
    }

    console.log('Login Successfully');
    res.redirect(`/invest?id=${manager.id}`);
  });




  app.route('/msign')
  .get((req, res) => {
    res.render('msign', { messages: req.flash() });
  })
  .post(async (req, res) => {
    try {
      const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
      const { name, email } = req.body;
      const manager = await Manager.addadmin({
        name,
        email,
        password: hashedPwd,
      });
      const id = manager.id;

      req.login(manager, (err) => {
        if (err) {
          console.error(err);
          return res.status(500).render('error', {
            error: 'Internal Server Error. Please try again later.',
            details: err.message
          });
        }
        return res.redirect('/home?id=' + id);
      });
    } catch (err) {
      console.error("Error Occurred", err);
      req.flash('error', 'Sorry, Please Enter Valid Credentials');
      return res.status(500).render('error', {
        error: 'Sorry, Please Enter Valid Credentials',
        details: err.message
      });
    }
  });


app.route('/isign')
  .get((req, res) => {
    res.render('isign', { messages: req.flash() }); // Pass flash messages to the view
  })
  .post(async (req, res) => {
    try {
      const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
      const { name, email } = req.body;
      const investor = await Investor.addInvestor({
        name,
        email,
        password: hashedPwd,
      });
      const id = investor.id;
      req.login(investor, (err) => {
        if (err) {
          console.log(err);
        }
        return res.redirect('/invest?id=' + id);
      })

    } catch (err) {
      console.error("Error Occurred", err);
      req.flash('error', 'Sorry, Please Enter Valid Credentials'); // Set flash message
      return res.status(500).render('error', { error: 'Sorry, Please Enter Valid Credentials', details: err.message });
    }
  });


  app.route('/wsign')
  .get((req, res) => {
    res.render('wsign', { messages: req.flash() }); // Pass flash messages to the view
  })
  .post(async (req, res) => {
    try {
      //const hashedPwd = await bcrypt.hash(req.body.password, saltRounds);
      const { name, email,password,phone } = req.body;
      const investor = await workers.addadmin({
        name,
        email,
        password,
        phone
      });
      const id = investor.id;
      req.login(investor, (err) => {
        if (err) {
          console.log(err);
        }
        return res.redirect('/works?id=' + id);
      })

    } catch (err) {
      console.error("Error Occurred", err);
      req.flash('error', 'Sorry, Please Enter Valid Credentials'); // Set flash message
      return res.status(500).render('error', { error: 'Sorry, Please Enter Valid Credentials', details: err.message });
    }
  });






app.get('/', (req, res) => {
  res.render('main');
});

app.get('/home', async (req, res) => {
  try {
    const id = req.query.id || 23;

    const manager = await Manager.findByPk(id);
    const amount = await Investor.findAll();
    const request = await requests.findAll();

    res.render('home', { manager, amount, request, id });
  } catch (err) {
    console.error("Error Occurred", err);
    req.flash('error', 'Internal Server Error'); // Set flash message
    res.status(500).redirect('/home?id=' + req.query.id);
  }
});

app.get('/investreq', async (req, res) => {
  try {
    const request = await requests.findAll();
    const id = req.query.id;

    res.render('investreq', { request, id });
  } catch (err) {
    console.error("Error Occurred", err);
    req.flash('error', 'Internal Server Error'); // Set flash message
    res.status(500).redirect('/investreq?id=' + req.query.id);
  }
});



app.post('/update-manager/:id', async (req, res) => {
  try {
    const managerId = req.params.id;
    const { name, email,MID, crop, acre, village, district, state, pin } = req.body;
    console.log(MID)
    const updatedManager = await Manager.update(
      {
        name,
        email,
        MID,
        crop,
        acre,
        village,
        district,
        state,
        pin,
      },
      {
        where: { id: managerId },
      }
    );

    if (updatedManager[0]) {
      return res.redirect('/home?id=' + managerId);
    } else {
      req.flash('error', 'Manager not found');
      return res.redirect('/home?id=' + managerId);
    }
  } catch (error) {
    console.error('Error updating manager:', error);
    req.flash('error', 'Internal Server Error');
    return res.redirect('/profile');
  }
});
app.get('/logout',(req,res)=>{
  res.redirect('/');
})


app.post('/accept', async (req, res) => {
  try {
    const requestId = req.body.requestId;
    const id = req.query.id;

    const manager = await Manager.findByPk(id);

    if (!manager) {
      req.flash('error', 'Manager not found'); // Set flash message
      return res.status(404).redirect('/investreq?id=' + id);
    }

    const request = await requests.findByPk(requestId);

    if (!request) {
      req.flash('error', 'Request not found'); // Set flash message
      return res.status(404).redirect('/investreq?id=' + id);
    }

    manager.sum += request.amount;

    await manager.save();

    await requests.update({ accept: true }, { where: { id: requestId } });

    return res.redirect('/investreq?id=' + id);
  } catch (err) {
    console.error('Error updating request:', err);
    req.flash('error', 'Internal Server Error'); // Set flash message
    res.status(500).redirect('/investreq?id=' + req.query.id);
  }
});



app.get('/isign', (req, res) => {
  res.render('isign', { messages: req.flash() }); // Pass flash messages to the view
});

app.get('/invest', async (req, res) => {
  try {
    const crop = await Manager.findAll();
    const investor = await Investor.findAll();
    const id = req.query.id || 20;
    const sid = req.query.id;

    res.render('investors', { crop, investor, id, sid });
  } catch (err) {
    console.error("Error Occurred", err);
    req.flash('error', 'Internal Server Error'); // Set flash message
    res.status(500).redirect('/invest?id=' + id);
  }
});

app.get('/myinvestreq', async (req, res) => {
  try {
    const crop = await Manager.findAll();
    const investor = await Investor.findAll();
    const request = await requests.findAll();
    const id = req.query.id;
    const sid = req.query.sid;

    res.render('myinvestsreq', { crop, investor, request, id, sid });
  } catch (err) {
    console.error("Error Occurred", err);
    req.flash('error', 'Internal Server Error'); // Set flash message
    res.status(500).redirect('/myinvestreq?id=' + req.query.id);
  }
});

app.post('/invest', async (req, res) => {
  try {
    console.log(req.body);
    const { name, amount, cid, iid } = req.body;
    await requests.addadmin({
      name,
      amount,
      cid,
      iid,
      accept: false,
    });
    const id = iid;

    return res.redirect('/invest?id=' + id);
  } catch (err) {
    console.error('Error Occurred', err);
    req.flash('error', 'Internal Server Error'); // Set flash message
    return res.status(500).redirect('/invest?id=' + req.body.iid);
  }
});



app.get('/wsign', (req, res) => {
  res.render('wsign', { messages: req.flash() }); // Pass flash messages to the view
});




app.get('/works', async (req, res) => {
  try {
    const allWorks = await works.findAll(); // Change variable name
    const crop = await Manager.findAll();
    const investor = await Investor.findAll();
    const id = req.query.id;
    const sid = req.query.id;

    res.render('works', { works: allWorks, crop, investor, id, sid }); // Use the updated variable name
  } catch (err) {
    console.error("Error Occurred", err);
    req.flash('error', 'Internal Server Error');
    res.status(500).redirect('/works?sid=' + req.query.id);
  }
});


app.get('/myworks', async (req, res) => {
  try {
    const allWorks = await works.findAll(); // Change variable name
    
    res.render('myworks', { works: allWorks }); // Use the updated variable name
  } catch (err) {
    console.error("Error Occurred", err);
    req.flash('error', 'Internal Server Error');
    res.status(500).redirect('/myworks?sid=' + req.query.id);
  }
});

app.get('/myworkers', async (req, res) => {
  try {
    const myworkers = await workers.findAll();

    res.render('workers', { myworkers}); // Updated variable name
  } catch (err) {
    console.error("Error Occurred", err);
    req.flash('error', 'Internal Server Error');
    res.status(500).redirect('/myworkers'); // Now id is defined in this scope
  }
});





app.post('/works', async (req, res) => {
  let id; 

  try {
    console.log(req.body);
    const { title, amount, date, time } = req.body;
    await works.addadmin({ // Use the correct model name
      title,
      amount,
      date,
      time,
    });
    id = req.query.id;

    return res.redirect('/home?id=' + id);
  } catch (err) {
    console.error('Error Occurred', err);
    req.flash('error', 'Internal Server Error');
    return res.status(500).redirect('/home?id=' + id);
  }
});


app.post('/workers', async (req, res) => {
 

  try {
    console.log(req.body);
    const { name,phone } = req.body;
    await workers.addadmin({ // Use the correct model name
    name,
    phone
    });

    return res.redirect('/works');
  } catch (err) {
    console.error('Error Occurred', err);
    req.flash('error', 'Internal Server Error');
    return res.status(500).redirect('/works');
  }
});

app.post('/updateworker/:id', async (req, res) => {
  try {
    const id = req.params.id; // Correct syntax to get id from request parameters
    console.log(req.body);
    const { name, phone, wid } = req.body;
console.log('id', id );
    // Use the correct model name and fix the update syntax
    await workers.update(
      {
        name,
        phone,
        wid,
      },
      {
        where: { id: id }, // or simply { id } in ES6
      }
    );

    return res.redirect('/works?id=' + id);


  } catch (err) {
    console.error('Error Occurred', err);
    req.flash('error', 'Internal Server Error');
    return res.status(500).redirect('/works');
  }
});




const PORT = process.env.PORT || 3800;
app.listen(PORT, () => {
  console.log(`Server started running on port ${PORT}`);
});
