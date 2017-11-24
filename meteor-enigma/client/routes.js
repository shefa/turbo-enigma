import { FlowRouter } from 'meteor/kadira:flow-router';
import { BlazeLayout } from 'meteor/kadira:blaze-layout';

function wait_for_x(path,i)
{
    if(i>10) return;
    var x = $('a[href="'+path+'"]');
    if(x.length==0) return Meteor.setTimeout(function(){wait_for_x(path,i+1);},300);
    x.addClass("active");
}
function exit_active(context){
    $('a[href="'+context.path+'"]').removeClass("active");
}

FlowRouter.triggers.enter([function(context){wait_for_x(context.path,0);}]);
FlowRouter.triggers.exit([exit_active]);

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

FlowRouter.route('/deskew/:_id', {
    name: 'deskew.image',
    action(){
        BlazeLayout.render('App_body', {main: 'deskew_page'});
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
