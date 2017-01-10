/*
  @author Sam Heutmaker [samheutmaker@gmail.com]
*/

import React, {Component, PropTypes} from 'react'
import ContentRow from './../components/ContentRow'
import RepoNotifications from './../components/RepoNotifications'
import isEmpty from './../util/IsEmpty'

export default class RepoSettings extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		let repoId = this.props.repoDetails.activeRepo.id;
		this.context.actions.listRepoNotifications(repoId);
	}
	componentWillUnmount() {
		this.context.actions.resetNotifState();
	}
	renderCredentials() {
		let creds = this.props.registriesMap[this.props.activeRepo.credId]
		return (
			<div className="FlexColumn">
				<div className="FlexRow SpaceBetween">
					<div className="FlexRow">
						<label>Registry Credentials
							<span className="TealColor">&nbsp;-&nbsp;{creds.provider}</span>
						</label>
					</div>
					<div className="FlexRow">
						<i className="icon icon-dis-close" 
						   onClick={() => this.context.actions.toggleActiveRepoSettings()}/>
					</div>
				</div>
				<div className="FlexRow Row">
					<div className="Flex1">
						<label className="small">Key Name</label>
						<div className="Value">{creds.name}</div>
					</div>
					<div className="Flex1">
						<label className="small">Key Region</label>
						<div className="Value">{creds.region}</div>
					</div>
				</div>
				{this.renderRepoDetails(creds)}
			</div>
		);
	}
	renderRepoDetails(creds){
		if(creds.provider == 'ECR') {
			return (
				<div className="FlexRow">
					<div className="Flex1">
						<label className="small">Public Key</label>
						<div className="Value">{creds.key}</div>
					</div>
					<div className="Flex1">
						<label className="small">Private Key</label>
						<div className="Value">******************</div>
					</div>
				</div>
			);
		}
	}
	renderRepoNotifications(){
		let notifs = this.props.notif.notifs;
		return (
			<RepoNotifications {...this.props} notifs={notifs}/>
		);
	}
	renderSettings(){
		let rows = [{
			columns: [{
                icon:'icon icon-dis-credential',
                renderBody: this.renderCredentials.bind(this)
            }]
		}, {
			columns: [{
                icon:'icon icon-dis-notification',
                renderBody: this.renderRepoNotifications.bind(this)
            }]
		}];

		return rows.map(this.renderContentRow);
	}
	renderContentRow(row, index){
		return (
			<ContentRow key={index}
						row={row} />
		);
	}
	render() {	
		return (
			<div className="RepoSettingsContainer">
				{this.renderSettings()}
			</div>
		);
	}
}

RepoSettings.propTypes =  {
	activeRepo: PropTypes.object.isRequired
};

RepoSettings.childContextTypes = {
	actions: PropTypes.object
};

RepoSettings.contextTypes = {
	actions: PropTypes.object
};
