/*
  $Id: $
  @file GetRegionsForProvider.java
  @brief Contains the GetRegionsForProvider.java class

  @author Rahul Singh [rsingh]
  Copyright (c) 2013, Distelli Inc., All Rights Reserved.
*/
package com.distelli.europa.ajax;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.amazonaws.regions.*;
import com.distelli.europa.models.*;
import com.distelli.gcr.*;
import com.distelli.webserver.AjaxHelper;
import com.distelli.webserver.AjaxRequest;
import com.distelli.webserver.HTTPMethod;
import com.distelli.webserver.RequestContext;
import com.distelli.europa.EuropaRequestContext;
import com.google.inject.Singleton;

import lombok.extern.log4j.Log4j;

@Log4j
@Singleton
public class GetRegionsForProvider extends AjaxHelper<EuropaRequestContext>
{
    private static Map<String, String> ecrRegionToArea = new HashMap<String, String>();
    static {
        ecrRegionToArea.put("us-east-1", "US East (N. Virginia)");
        ecrRegionToArea.put("us-east-2", "US East (Ohio)");
        ecrRegionToArea.put("us-west-1", "US West (N. California)");
        ecrRegionToArea.put("us-west-2", "US West (Oregon)");
        ecrRegionToArea.put("eu-west-1", "EU (Ireland)");
        ecrRegionToArea.put("eu-west-2", "EU (London)");
        ecrRegionToArea.put("eu-central-1", "EU (Frankfurt)");
        ecrRegionToArea.put("ap-northeast-1", "Asia Pacific (Tokyo)");
        ecrRegionToArea.put("ap-southeast-1", "Asia Pacific (Singapore)");
        ecrRegionToArea.put("ap-southeast-2", "Asia Pacific (Sydney)");
        ecrRegionToArea.put("ca-central-1", "Canada (Central)");
    }

    public GetRegionsForProvider()
    {
        this.supportedHttpMethods.add(HTTPMethod.GET);
    }

    public Object get(AjaxRequest ajaxRequest, EuropaRequestContext requestContext)
    {
        RegistryProvider provider = ajaxRequest.getParamAsEnum("provider", RegistryProvider.class, true);
        List<RegistryRegion> regions = new ArrayList<RegistryRegion>();
        switch(provider)
        {
        case ECR:
            List<Region> ecrRegions = RegionUtils.getRegionsForService("ecr");
            for(Region ecrRegion : ecrRegions)
            {
                String displayName = ecrRegionToArea.get(ecrRegion.getName());
                if(displayName == null)
                    displayName = ecrRegion.getName();
                RegistryRegion region = RegistryRegion
                .builder()
                .displayName(displayName)
                .regionCode(ecrRegion.getName())
                .build();
                regions.add(region);
            }
            break;
        case GCR:
            for(GcrRegion gcrRegion : GcrRegion.values())
            {
                if(gcrRegion == GcrRegion.DEFAULT)
                    continue;
                RegistryRegion region = RegistryRegion
                .builder()
                .displayName(gcrRegion.toString())
                .regionCode(gcrRegion.getEndpoint())
                .build();
                regions.add(region);
            }
            break;
        }
        return regions;
    }
}
