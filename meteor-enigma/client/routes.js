import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

FlowRouter.route('/skew', {
  name: 'skew.page',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'skew_page' });
  }
});

FlowRouter.route('/demo', {
  name: 'demo.page',
  action(params, queryParams) {
    BlazeLayout.render('App_body', { main: 'demo_page' });
  }
});

FlowRouter.route('/', {
  name: 'App.home',
  action() {
    BlazeLayout.render('App_body', { main: 'home_page' });
  },
});

FlowRouter.route('/process/:_id', {
    name: 'process.image',
    action(){
        BlazeLayout.render('App_body', {main: 'process_page'});
    },
});

FlowRouter.route('/try', {
    name: 'try.page',
    action() {
        BlazeLayout.render('App_body',{main: 'try'});
    },
});

// the App_notFound template is used for unknown routes and missing lists
FlowRouter.notFound = {
  action() {
    BlazeLayout.render('App_body', { main: 'App_notFound' });
  },
};
