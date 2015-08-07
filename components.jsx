// This file will be use on the client and on the server

/// Collections
Items = new Mongo.Collection('items');

const {Link} = ReactRouter;

/// Components
App = React.createClass({

  getInitialState() {
    ItemsSub = Meteor.subscribe("items", () => {
      this.setState({isReady: true});
    });

    return {
      isReady: false,
    };
  },

  render() {
    return (
      <div>  
        <header>Header { (this.state.isReady) ? "(..sub ready, live data now!)" : null }</header>

        {this.props.children}

        <footer>Footer</footer>
      </div>
    );
  }
});

class Another extends React.Component {
  constructor() {
    super();
  }

  render() {
    return <div> Go to: <Link to="/">Home</Link>|<a href="/">Home (full reload)</a></div>
  }
}

Home = React.createClass({

  mixins: [ReactMeteorData],

  getMeteorData() {
    return {
      items: Items.find().fetch()
    };
  },

  getInitialState: function() {
    return {};
  },

  _addOne() {
    Items.insert({title: `test ${Math.round(Math.random()*100)}`})
    console.log('new')
  },

  _remove(ev) {
    Items.remove(ev.target.id)
    console.log('remove '+ev.target.id)
  },

  render() {
    return <div>
      Go to: <Link to="/another">another page</Link>

      {
        this.data.items.map((item) => {
          return <h4 key={item._id} id={item._id} onClick={this._remove} >{item.title}</h4>
        }.bind(this))
      }
      
      <p>
        <button onClick={this._addOne}>Add One</button>
      </p>

    </div>
  }
});

/// Isomorphic Router

const {Route, Router} = ReactRouter;

Meteor.startup( function() {
  AppRoutes = (
    <Router  >
      <Route component={App}>
        <Route path="/" component={Home} />
        <Route path="another" component={Another} />
      </Route>
    </Router>
  );

  ReactRouterSSR.Run(AppRoutes);
});