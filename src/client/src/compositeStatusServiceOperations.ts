import { createAction, handleActions } from 'redux-actions'
import * as _ from 'lodash'
import { ACTION_TYPES as REF_ACTION_TYPES } from './referenceOperations'
import { ServiceStatus, ServiceInstanceStatus } from './types/'

export enum ACTION_TYPES {
  COMPOSITE_STATUS_SERVICE = '@ReactiveTraderCloud/COMPOSITE_STATUS_SERVICE',
}

export const fetchCompositeServiceStatus = createAction(ACTION_TYPES.COMPOSITE_STATUS_SERVICE)

export const compositeStatusServiceEpic = compositeStatusService$ => action$ => {
  return action$.ofType(REF_ACTION_TYPES.REFERENCE_SERVICE)
    .flatMapTo(compositeStatusService$.serviceStatusStream)
    .map(service => getServiceStatus(service))
    .map(fetchCompositeServiceStatus)
}

const getServiceStatus = (service) => {
  return _.mapValues(service.services, (service: ServiceStatus) => {
    return {
      isConnected: service.isConnected,
      connectedInstanceCount: countInstances(service.instanceStatuses),
      serviceType: service.serviceType,
    }
  })
}
export default handleActions({
  [ACTION_TYPES.COMPOSITE_STATUS_SERVICE]: (state, action) => action.payload,
},                           {})

export function countInstances(instances) {
  return instances
    .filter((instance: ServiceInstanceStatus) => instance.isConnected)
    .length
}
