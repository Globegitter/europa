/*
  @author Sam Heutmaker [samheutmaker@gmail.com]
*/

import React, { Component, PropTypes } from 'react'
import {Link} from 'react-router'
import NPECheck from './../util/NPECheck'

export default class Footer extends Component {
	constructor(props) {
		super(props);

		this.state = {};
	}
	renderLogos(){
		let logos = [
			{
				src: '/public/images/vmdashboard-logo.svg',
				href: 'https://www.distelli.com/vm-dashboard'
			},
			{
				src: '/public/images/k8sdashboard-logo.svg',
				href: 'https://www.distelli.com/kubernetes'
			},
			{
				src: '/public/images/distelli-europa-cr-logo.svg',
				href: 'https://www.distelli.com/europa'
			},
			{
				src: '/public/images/passly-logo.svg',
				href: 'https://www.passly.io'
			}
		];

		return (
			<div className="LogoContainer">
				{logos.map((logo, i) => {
					return (
						<a href={logo.href} key={i} target="_blank">
							<img src={logo.src} />
						</a>
					);
				})}
			</div>
		);
	}
	logoFooter(){
		return (
			<div className="LogoFooter">
				<img className="Distelli" src='/public/images/distelli-mark.svg' />
				<h2>Automation for software teams</h2>
				{this.renderLogos()}
			</div>
		);
	}
	footer(){
		let europa;

		if(this.props.requester) {
			europa = (this.props.isEnterprise) ? 'Enterprise' : 'Premium';
		} else {
			europa = 'Community';
		}
		return (
			<div className="Footer">
				<div className="FooterInside">
					<div className="Flex1"></div>
					<div className="Flex1"></div>
					<div className="Version"><span>Europa&nbsp;</span> {europa} - Version {PAGE_PROPS.version || 'Unknown'}</div>
				</div>
			</div>
		);
	}
	render(){
		if(window.location.pathname == '/' || typeof this.props.isLoggedIn != 'undefined' && !this.props.isLoggedIn) {
			return this.logoFooter();
		} else {
			return this.footer();
		}
	}
}

Footer.contextTypes = {
	router: PropTypes.object,
	actions: PropTypes.object
};

Footer.childContextTypes = {
	actions: PropTypes.object,
	router: PropTypes.object
};




