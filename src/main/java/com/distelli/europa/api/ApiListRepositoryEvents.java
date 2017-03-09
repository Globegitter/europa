/*
  $Id: $
  @author Rahul Singh [rsingh]
  Copyright (c) 2017, Distelli Inc., All Rights Reserved.
*/
package com.distelli.europa.api;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.inject.Inject;
import javax.inject.Singleton;

import com.distelli.europa.Constants;
import com.distelli.europa.EuropaRequestContext;
import com.distelli.europa.ajax.AjaxErrors;
import com.distelli.europa.api.models.*;
import com.distelli.europa.api.transformers.*;
import com.distelli.europa.db.ContainerRepoDb;
import com.distelli.europa.db.RegistryManifestDb;
import com.distelli.europa.db.RepoEventsDb;
import com.distelli.europa.models.ContainerRepo;
import com.distelli.europa.models.RegistryManifest;
import com.distelli.europa.models.RepoEvent;
import com.distelli.persistence.PageIterator;
import com.distelli.webserver.AjaxClientException;
import com.distelli.webserver.JsonError;
import com.distelli.webserver.WebResponse;

import lombok.extern.log4j.Log4j;

@Log4j
@Singleton
public class ApiListRepositoryEvents extends ApiBase
{
    @Inject
    protected RepoEventsDb _eventsDb;
    @Inject
    protected EventsTransformer _eventsTransformer;

    public ApiListRepositoryEvents()
    {

    }

    public WebResponse handleApiRequest(EuropaRequestContext requestContext) {
        String repoId = getPathParam("id", requestContext);
        String domain = requestContext.getOwnerDomain();

        int pageSize = getParamAsInt("pageSize", 50, requestContext);
        String marker = getParam("marker", requestContext);
        String order = getParam("order", requestContext);
        boolean dbAscending = false;
        if(order == null)
            order = Constants.API_ORDER_ASCENDING;

        if(order.equals(Constants.API_ORDER_ASCENDING))
            dbAscending = false;
        else if(order.equals(Constants.API_ORDER_DESCENDING))
            dbAscending = true;
        else
            throw(new AjaxClientException("Invalid value for parameter: order",
                                          JsonError.Codes.BadParam,
                                          400));
        PageIterator iter = new PageIterator()
        .pageSize(pageSize)
        .marker(marker);
        if(!dbAscending)
            iter.backward();

        List<RepoEvent> events = _eventsDb.listEvents(requestContext.getOwnerDomain(),
                                                    repoId,
                                                    iter);
        if(dbAscending) {
            List<RepoEvent> reversedEvents = new ArrayList<RepoEvent>();
            reversedEvents.addAll(events);
            Collections.reverse(reversedEvents);
            events = reversedEvents;
        }

        List<ApiEvent> apiEvents = _eventsTransformer.transform(events);
        ApiEventList eventList = ApiEventList
        .builder()
        .events(apiEvents)
        .prevMarker(dbAscending ? iter.getMarker() : iter.getPrevMarker())
        .nextMarker(dbAscending ? iter.getPrevMarker() : iter.getMarker())
        .build();
        return toJson(eventList);
    }
}