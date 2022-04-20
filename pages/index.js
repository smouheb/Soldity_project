import React, {Component} from 'react';
import {Card, Button} from 'semantic-ui-react';
import factory from '../ethereum/factory';
import Layout from '../component/Layout';

class Campaign extends Component {

  static async getInitialProps(){
    const campaign = await factory.methods.getDeployedCampaigns().call();

    return { campaign };
  }

  renderCampaign(){

    const campaignForm = this.props.campaign.map(address => {
      return {
        header: address,
        description: <a>Campaign details</a>,
        fluid: true
      };
    });
    return <Card.Group items={campaignForm}/>;
  }

  render(){
    return(
      <div>
        <Layout/>
        <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/2.2.12/semantic.min.css"></link>
        {this.renderCampaign()}
        <Button content="Add Campaign" icon="add circle" primary />
      </div>
  );
  }
}

export default Campaign;
