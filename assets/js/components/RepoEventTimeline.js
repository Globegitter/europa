/*
  @author Sam Heutmaker [samheutmaker@gmail.com]
*/

import React, {Component, PropTypes} from 'react'
import NPECheck from './../util/NPECheck'
import RepoOverview from './RepoOverview'
import RepoEventItem from './../components/RepoEventItem'
import RegistryProviderIcons from './../util/RegistryProviderIcons'
import ConvertTimeFriendly from './../util/ConvertTimeFriendly'

export default class RepoEventTimeline extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	renderLegend(){

		let navItems = [
			{
				text: 'Overview',
				key: 'OVERVIEW',
			},
			{
				text: 'Tags',
				key: 'TAGS',
			},
			{
				text: 'Events',
				key: 'EVENTS',
			}
		];

		return (
			<div className="TimelineLegend">
				<div className="TimelineNavigation">
					{navItems.map((item) => {
						let activeSection = NPECheck(this.props, 'repoDetails/timelineSection', '');
						return (
							<div key={item.key} 
								 className={(activeSection == item.key) ? 'Active' : ''}
								 onClick={() => this.context.actions.setTimelineSection(item.key)}>
								{item.text}
							</div>
						);
					})}
				</div>
				{this.renderHeaderAction()}
			</div>
		);
	}
	renderHeaderAction(){
		if(NPECheck(this.props, 'repoDetails/timelineSection', '') == 'OVERVIEW') {
			let isEdit = NPECheck(this.props, 'repoDetails/editOverview', false);

			return (
				<span className="ThickBlueText" onClick={() => this.context.actions.toggleRepoOverviewEdit()}>
					{(isEdit) ? (NPECheck(this.props, 'repoDetails/isOverviewModified')) ? 'Preview Changes' : 'Cancel' : 'Edit Read Me'}
				</span>
			);
		}

		if(!NPECheck(this.props, 'events/length', true)) {
			return (
				<i className="icon icon-dis-waiting rotating"/>
			);
		}
	}
	renderRepoContent(){
		let activeSection = NPECheck(this.props, 'repoDetails/timelineSection', '');
		let noEvents = !NPECheck(this.props, 'events/length', true);
		let noTags = !NPECheck(this.props, 'manifests/length', true);

		switch(activeSection) {

			case 'OVERVIEW':
				return (
					<RepoOverview {...this.props}/>
				);
			break;

			case 'EVENTS':
				if(noEvents) return this.renderNoEvents();
				return (
					<div className="TimelineContainer">
						{this.renderEventTimeline()}
					</div>	
				);
			break;

			case 'TAGS':
				if(noTags) return this.renderNoTags();
				return (
					<div className="TagsContainer">
						{this.renderRepoEventTags()}
					</div>
				);
			break;
		}
	}
	renderEventTimeline(){
		return this.props.events.sort((firstEvent, secondEvent) => (firstEvent.eventTime >= secondEvent.eventTime) ? -1 : 1 )
								.map((event, index) => this.renderRepoEventItem(event, index))
	}
	renderRepoEventItem(event, index){
		return (
			<RepoEventItem {...this.props}
						   key={index}
						   event={event} />
		);
	}
	renderRepoEventTags(){
		let activeRepo = NPECheck(this.props, 'repoDetails/activeRepo', {});

		return this.props.manifests.sort((firstTag, secondTag) => (firstTag.pushTime >= secondTag.pushTime) ? -1 : 1 )
								.map((tag, index) => this.renderRepoEventTagItem(tag, index, activeRepo))
	}
	renderRepoEventTagItem(tag, index, activeRepo){
		let time = tag.pushTime;
		let friendlyTime = ConvertTimeFriendly(time);
		let shortManifestId = tag.manifestId.substring(0, 20) + '...';
		let icon = 'icon icon-dis-box-uncheck';

		if(NPECheck(this.props, 'repoDetails/selectedManifests', []).includes(tag)) {
			icon = 'icon icon-dis-box-check';
		}

		return (
			<div key={index} className="RepoTagItem">
				<i className={icon} 
				   data-tip="View Pull Commands For This Tag" 
				   data-for="ToolTipTop" 
				   onClick={() => this.context.actions.toggleSelectedManifest(tag)}/>
				<span className="ImageSha" data-tip={tag.manifestId}>	
					{shortManifestId}
				</span>
				<span className="Tags">
					{tag.digests.map((tag, index) => {
						return (
							<span className="Tag" key={index}>{tag}</span>
						);
					})}
				</span>
				<span className="Size">
					<span className="Label">Virtual Size:&nbsp;</span>
					<span className="Value">{tag.virtualSize}</span>
				</span>
				<span className="Pushed">
					<span className="Label">Pushed:&nbsp;</span>
					<span className="Value">{friendlyTime}</span>
				</span>
			</div>
		);
	}
	renderNoTags(){
		return (
			<div className="TimelineContainer">
				<div className="Timeline">
					<div className="NoContent">
						<h3>
							No Tags Found
						</h3>
						<p> If you just added this repository, it may take a second to populate historical data for this repository.</p>
					</div>
				</div>
			</div>
		);
	}
	renderNoEvents(){
		return (
			<div className="TimelineContainer">
				<div className="Timeline">
					<div className="NoContent">
						<h3>
							No Events Found
						</h3>
						<p> If you just added this repository, it may take a second to populate historical data for this repository.</p>
					</div>
				</div>
			</div>
		);
	}
	render() {
		return (
			<div className="RepoEventTimeline">
				<div className="Timeline">
					{this.renderLegend()}
					{this.renderRepoContent()}
				</div>
			</div>
		);
	}	
}

RepoEventTimeline.propTypes = {
	events: PropTypes.array,
	manifests: PropTypes.array,
	
};

RepoEventTimeline.childContextTypes = {
    actions: PropTypes.object
};

RepoEventTimeline.contextTypes = {
    actions: PropTypes.object
};

