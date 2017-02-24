import React, {Component, PropTypes} from 'react'
import { Radio, Button, FormGroup, Panel } from 'react-bootstrap'
import {Icon} from '@conveyal/woonerf'
import Select from 'react-select'

import VirtualizedEntitySelect from './VirtualizedEntitySelect'
import { getEntityName } from '../util/gtfs'

export default class FareRulesForm extends Component {
  static propTypes = {
    activeEntity: PropTypes.object,
    updateActiveEntity: PropTypes.func,
    activeComponent: PropTypes.string,
    tableData: PropTypes.object,
    zones: PropTypes.object,
    zoneOptions: PropTypes.array
  }
  render () {
    const {
      activeEntity,
      updateActiveEntity,
      activeComponent,
      tableData,
      zones,
      zoneOptions
    } = this.props
    return (
      <div>
        <p>Specify which routes or zones <strong>{activeEntity.fare_id}</strong> fare applies to.</p>
        <span className='pull-right'>{activeEntity && activeEntity.fareRules.length} rules apply to this fare</span>
        <Button
          style={{marginBottom: '15px'}}
          onClick={() => {
            const rules = [...activeEntity.fareRules]
            rules.unshift({fare_id: activeEntity.fare_id})
            updateActiveEntity(activeEntity, activeComponent, {fareRules: rules})
          }}
        ><Icon type='plus' /> Add rule</Button>
        {activeEntity.fareRules.map((rule, index) => {
          let ruleEntity
          if (rule.route_id) {
            ruleEntity = tableData.route && tableData.route.find(r => r.route_id === rule.route_id)
          }
          return (
            <Panel
              key={`rule-${index}`}
            >
              <Button
                bsStyle='danger'
                bsSize='xsmall'
                className='pull-right'
                style={{marginLeft: '5px'}}
                key={Math.random()}
                onClick={() => {
                  const rules = [...activeEntity.fareRules]
                  rules.splice(index, 1)
                  updateActiveEntity(activeEntity, activeComponent, {fareRules: rules})
                }}
              ><Icon type='times' /></Button>
              <FormGroup>
                <Radio
                  inline
                  key={Math.random()}
                  checked={rule.route_id}
                  onChange={(evt) => {
                    const rules = [...activeEntity.fareRules]
                    rules[index] = {fare_id: activeEntity.fare_id}
                    rules[index].route_id = true
                    updateActiveEntity(activeEntity, activeComponent, {fareRules: rules})
                  }}
                >
                  <small>Route</small>
                </Radio>
                {' '}
                <Radio
                  inline
                  key={Math.random()}
                  checked={rule.origin_id || rule.destination_id}
                  onChange={(evt) => {
                    const rules = [...activeEntity.fareRules]
                    rules[index] = {fare_id: activeEntity.fare_id}
                    rules[index].origin_id = true
                    updateActiveEntity(activeEntity, activeComponent, {fareRules: rules})
                  }}
                >
                  <small>To/From</small>
                </Radio>
                {' '}
                <Radio
                  inline
                  key={Math.random()}
                  checked={rule.contains_id}
                  onChange={(evt) => {
                    const rules = [...activeEntity.fareRules]
                    rules[index] = {fare_id: activeEntity.fare_id}
                    rules[index].contains_id = true
                    updateActiveEntity(activeEntity, activeComponent, {fareRules: rules})
                  }}
                >
                  <small>Contains</small>
                </Radio>
              </FormGroup>
              {rule.route_id
                ? <VirtualizedEntitySelect
                  value={ruleEntity ? {value: ruleEntity.route_id, label: getEntityName('route', ruleEntity), entity: ruleEntity} : null}
                  component={'route'}
                  entityKey='route_id'
                  entities={tableData.route}
                  onChange={(input) => {
                    console.log(input)
                    const rules = [...activeEntity.fareRules]
                    rules[index].route_id = input ? input.value : null
                    updateActiveEntity(activeEntity, activeComponent, {fareRules: rules})
                  }}
                />
                : rule.contains_id // can be boolean (no zone specified) or string (specified zone_id)
                ? <Select
                  placeholder='Select zone which the itinerary passes through...'
                  clearable
                  noResultsText={`No zones found. Specify zones in stop.`}
                  key={Math.random()}
                  value={typeof rule.contains_id === 'string'
                    ? {value: rule.contains_id, label: `${rule.contains_id} zone (${zones[rule.contains_id] ? zones[rule.contains_id].length : 0} stops)`}
                    : null
                  }
                  onChange={(input) => {
                    console.log(input)
                    const rules = [...activeEntity.fareRules]
                    rules[index].contains_id = input ? input.value : null
                    updateActiveEntity(activeEntity, activeComponent, {fareRules: rules})
                  }}
                  options={zoneOptions}
                />
                : rule.origin_id || rule.destination_id
                ? [
                  <Select
                    placeholder='Select origin zone...'
                    clearable
                    noResultsText={`No zones found. Specify zones in stop.`}
                    key={Math.random()}
                    value={typeof rule.origin_id === 'string'
                      ? {value: rule.origin_id, label: `${rule.origin_id} zone (${zones[rule.origin_id] ? zones[rule.origin_id].length : 0} stops)`}
                      : null
                    }
                    onChange={(input) => {
                      console.log(input)
                      const rules = [...activeEntity.fareRules]
                      rules[index].origin_id = input ? input.value : null
                      updateActiveEntity(activeEntity, activeComponent, {fareRules: rules})
                    }}
                    options={zoneOptions}
                  />,
                  <Select
                    placeholder='Select destination zone...'
                    clearable
                    noResultsText={`No zones found. Specify zones in stop.`}
                    key={Math.random()}
                    value={typeof rule.destination_id === 'string'
                      ? {value: rule.destination_id, label: `${rule.destination_id} zone (${zones[rule.destination_id] ? zones[rule.destination_id].length : 0} stops)`}
                      : null
                    }
                    onChange={(input) => {
                      console.log(input)
                      const rules = [...activeEntity.fareRules]
                      rules[index].destination_id = input ? input.value : null
                      updateActiveEntity(activeEntity, activeComponent, {fareRules: rules})
                    }}
                    options={zoneOptions}
                  />
                ]
                : null
              }
            </Panel>
          )
        })}
      </div>
    )
  }
}