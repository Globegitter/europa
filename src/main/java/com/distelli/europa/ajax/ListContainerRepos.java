/*
  $Id: $
  @file ListContainerRepos.java
  @brief Contains the ListContainerRepos.java class

  @author Rahul Singh [rsingh]
  Copyright (c) 2013, Distelli Inc., All Rights Reserved.
*/
package com.distelli.europa.ajax;

import com.distelli.persistence.PageIterator;

import com.distelli.europa.db.*;
import com.distelli.europa.models.*;
import com.distelli.webserver.*;
import javax.inject.Inject;
import com.google.inject.Singleton;
import lombok.extern.log4j.Log4j;
import org.eclipse.jetty.http.HttpMethod;
import com.distelli.europa.EuropaRequestContext;

@Log4j
@Singleton
public class ListContainerRepos extends AjaxHelper<EuropaRequestContext>
{
    @Inject
    private ContainerRepoDb _db;

    public ListContainerRepos()
    {
        this.supportedHttpMethods.add(HTTPMethod.GET);
    }

    /**
       Params:
       - Provider (optional)
       - Region (optional)
       - pageSize (optional)
       - marker (optional)
    */
    public Object get(AjaxRequest ajaxRequest, EuropaRequestContext requestContext)
    {
        RegistryProvider provider = ajaxRequest.getParamAsEnum("provider", RegistryProvider.class);
        String region = ajaxRequest.getParam("region");
        int pageSize = ajaxRequest.getParamAsInt("pageSize", 100);
        String marker = ajaxRequest.getParam("marker");
        String domain = requestContext.getOwnerDomain();

        PageIterator pageIterator = new PageIterator()
        .pageSize(pageSize)
        .marker(marker)
        .forward();

        if(provider == null && region == null)
            return _db.listRepos(domain, pageIterator);
        else if(provider != null)
        {
            if(region != null)
                return _db.listRepos(domain, provider, region, pageIterator);
            else
                return _db.listRepos(domain, provider, pageIterator);
        }

        return _db.listRepos(domain, pageIterator);
    }
}
