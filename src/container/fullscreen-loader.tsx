import React from 'react';
import { Root, View, Spinner } from "native-base";

export const FullScreenLoader = (props) => (
  <Root>
    <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <Spinner size='large' />
    </View>
  </Root>
);