import ScreenBase from "../common/screen-base";
import React from "react";
import { View, Image, Text, Alert } from 'react-native';
import { Icon } from 'native-base';
import { Header } from 'react-native-elements';
import {RNSlidingButton, SlideDirection} from 'rn-sliding-button';
import RequestModel from "../../models/firebase/request-model";
import PhotographerService from "../../services/photographer-service";
import { IHomeState } from "../../store/reducers/home";
import { connect } from "react-redux";
import SessionService from "../../services/session-service";
import SessionModel from '../../models/firebase/session-model';
import { bindActionCreators } from "redux";
import { syncRemotePhotographerData } from "../../store/actions/home";
import PhotographerModel from "../../models/firebase/photographer-model";
import { firestore } from "react-native-firebase";
import Collections from "../../models/firebase/collections";
import UserModel from "../../models/firebase/user-model";

interface Props {
  home: IHomeState,
  syncRemotePhotographerData: (photographer: PhotographerModel) => {
    type: string;
    payload: PhotographerModel;
  }
}

interface State {
}

class Session extends ScreenBase<Props> {
  static navigationOptions = {
      header: null        
  }

  constructor(props: Props) {
    super(props);
  }
 
  endSession = () => {
    const { activeRequest, photographer } = this.props.home;

    if (!activeRequest) return;

    PhotographerService.deleteRequest(activeRequest).then(() => {
      const session: SessionModel = {
        photographerId: activeRequest.targetPhotographerId,
        photographerName: photographer.firstName,
        requesterId: activeRequest.requester.userId,
        requesterName: activeRequest.requester.firstName,
        location: activeRequest.location,
        picturesQtd: activeRequest.quantity,
        pricePerPicture: activeRequest.equipment.priceMin,
        pictures: [],
        date: activeRequest.creationDate,
        equipment: activeRequest.equipment,
      };

      const sessionPrice = (session.picturesQtd * session.pricePerPicture);

      SessionService.save(session).then(() => {
        const gains = sessionPrice;
        PhotographerService.addBalance(
          photographer.photographerId,
          gains
        ).then(() => {
          const newPhotographer = { ...photographer };
          newPhotographer.currentMoney += sessionPrice;

          firestore().collection(Collections.USERS).doc(session.requesterId).update({
            currentMoney: firestore.FieldValue.increment(sessionPrice * -1)
          } as UserModel);

          this.props.syncRemotePhotographerData(newPhotographer);
        });
      });

      // @ts-ignore
      this.props.navigation.navigate(('Home'), { rating: true });
    });
  }

  render() {
    return(
      <View>
            <Header
                centerComponent={{ text: 'SESSÃO EM ANDAMENTO', style: { color: '#fff', fontSize: 16 } }}
                containerStyle={{ paddingTop: 5, height: 60, backgroundColor: '#224CB4' }}
            />

            <View style={{ width: '100%', height: '100%', marginTop: '2%', alignItems: 'center' }}>

                <View style={{ marginBottom: '10%', alignItems: 'center', padding: 40}}>
                    <Image source={require('../../../assets/images/session2.png')}
                    style={{ width: 250, height: 250, marginBottom: -20 }}
                    ></Image>
                    <Text style={{ color: 'black', fontSize: 20 }}>Sessão Iniciada</Text>
                    <Text style={{ textAlign: 'center' }}>Tire boas fotos do seu cliente, você será avaliado após o trabalho!! :)</Text>
                </View>
                

                <RNSlidingButton
                style={{
                  height: 50, width: '90%', borderRadius: 4, backgroundColor: '#EA4335'
                }}
                height={50}
                onSlidingSuccess={() => this.endSession() }
                slideDirection={SlideDirection.RIGHT}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Icon type="FontAwesome5" name="angle-double-right" style={{ position: 'absolute', color: 'white', left: 20 }} />
                    <Text style={{ fontSize: 16, color: 'white' }}>FINALIZAR SESSÃO</Text>
                    </View>
                </RNSlidingButton>
            </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  home: state.home
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({syncRemotePhotographerData}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Session);