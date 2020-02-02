import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Map from './pages/Map';

const Routes = createAppContainer(
    createStackNavigator({
        Map: {
            screen: Map,
            navigationOptions: {
                title: 'goBus'
            }
        }
    }, {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: '#ffd500'
            },
        }
    })
);

export default Routes;
