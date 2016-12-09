import React, {Component} from 'react'
import {Link} from 'react-router'
import ReactTooltip from 'react-tooltip'
import ActionBinder from './../util/ActionBinder'

// Actions
import * as AddRegistryActions from './../actions/AddRegistryActions'
import * as RepoActions from './../actions/RepoActions'
import * as RegistryActions from './../actions/RegistryActions'


export default class Layout extends Component {
	constructor(props) {
		super(props);

		// Main State Store
		this.state = {
			registries: [],
			repos: [],
			registriesXHR: false,
			repositories: [],
			registry: {
				...RegistryActions.registryState(),
			},
			addRegistry: {
				...AddRegistryActions.addRegistryState(),
			},
			addRepo: {
				...RepoActions.addRepoState()
			}
		};
	}
	componentDidMount() {
		RegistryActions.listRegistries.call(this)
		RepoActions.listRepos.call(this)
	}
	componentDidUpdate(prevProps, prevState) {
		ReactTooltip.hide();
		ReactTooltip.rebuild();
	}
	getChildContext() {
		return {
			actions: ActionBinder([AddRegistryActions, RepoActions, RegistryActions], this),
			state: this.state,
			router: this.context.router
		};
	}
	render() {
		return (
			<div className="PageContainer">
				<nav className="TopNav">
				 <div className="MaxWidthContainer">
					<div className="Logo">
						<Link to="/repositories">
							<img src="assets/images/distelli-europa-logo.svg"
									 alt="Distelli Europa" />
						</Link>
					</div>
					<div className="FlexRow NavButtonContainer">
						<div className="Flex1">
							<Link to="/repositories" data-tip="View Repositories" data-for="ToolTipBottom">
								<i className="icon icon-dis-contents"/>
							</Link>
						</div>
						<div className="Flex1">
							<Link to="/registries" data-tip="View Registries" data-for="ToolTipBottom">
								<i className="icon icon-dis-docker" style={{fontSize: '1.5rem'}}/>
							</Link>
						</div>
						<div className="Flex1">
							<Link to="/settings" data-tip="Settings" data-for="ToolTipBottom">
								<i className="icon icon-dis-settings"/>
							</Link>
						</div>
					</div>
					</div>
				</nav>
				<div className="PageContent">
					<div className="MaxWidthContainer">
						{this.props.children}
						<ReactTooltip id="ToolTipBottom" place="top" type="dark" effect="float"/>
						<ReactTooltip id="ToolTipTop" place="top" type="dark" effect="float"/>
					</div>
				</div>
			</div>
		);
	}
}


Layout.contextTypes = {
	router: React.PropTypes.object
};

Layout.childContextTypes = {
	actions: React.PropTypes.object,
	state: React.PropTypes.object,
	router: React.PropTypes.object
};




