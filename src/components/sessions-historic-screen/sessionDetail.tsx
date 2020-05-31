import ScreenBase from "../common/screen-base";
import React from "react";
import { NavigationScreenOptions } from "react-navigation";
import { View, Text, Image, TouchableOpacity, Alert } from 'react-native';
import { Icon } from "native-base";
import { SliderBox } from 'react-native-image-slider-box';

interface Props {
    
}

interface State {
    session: object,
    photos: string[]
}

class SessionDetail extends ScreenBase<Props> {

    static navigationOptions: NavigationScreenOptions = {
        title: 'Detalhes',
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: '#000'
    };

    state: State = {
        session: {},
        photos: [
            'https://i.pinimg.com/originals/7b/d7/6a/7bd76ae8ced2405042c894bbaa05e2cd.jpg', 
            'https://i.pinimg.com/originals/60/79/71/607971f9a4f69d50a9467a6a61a95197.jpg', 
            'https://i.pinimg.com/originals/82/d2/97/82d2974f9992e04aa61a9eee57036b0d.jpg', 
            'https://d.wattpad.com/story_parts/598724270/images/153e334e0bffce20186079725790.jpg',
        ]
    };
 
    constructor(props: Props) {
        super(props);        
    }
    
    rateLayout = (rate) => {
        let i = 0;
        let stars = ''

        for(i=0; i<rate; i++) {
            stars = stars + '★'
        }
        for(i=0; i<5-rate; i++) {
            stars = stars + '☆'
        }
        return stars
    }

    componentDidMount() {
        this.setState({
            //@ts-ignore
            session: this.props.navigation.getParam('session', {})
        })
    }

    render() {        

        return(
            <View>
                <View style={{ width: '100%', height: '78%' }}>

                    <SliderBox 
                    images={this.state.photos}
                    dotColor="#F39A40"
                    inactiveDotColor="#90A4AE"
                    paginationBoxVerticalPadding={20}
                    circleLoop
                    sliderBoxHeight={'100%'}
                    />

                </View>

                <View style={{ width: '100%', height: '22%', borderTopWidth: 1, borderTopColor: '#CED4DA', padding: 20, paddingTop: 18 }}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>

                        <View style={{ width: '15%', height: 55, alignItems: 'center', justifyContent: 'center', top: 10 }}>
                            <View style={{ width: 60, height: 60, backgroundColor: "#B7C3EC", borderRadius: 60/2 }}>
                                <Image style={{ width: 60, height: 60, borderRadius: 60/2 }} source={{ uri: null }} />
                            </View>
                        </View>

                        <View style={{ marginLeft: 15, width: '85%'}}>
                            <Text numberOfLines={1} style={{fontSize: 18, marginBottom: 3, fontWeight: 'bold', color: '#000'}}>Fotógrafo(a) {this.state.session.photographerName}</Text>
                            <Text style={{ fontSize: 16, marginTop: 2 }}>Fotos tiradas com: { this.state.session.brand } { this.state.session.model}</Text>                            
                            <Text style={{ fontSize: 16 }}>Valor pago na sessão: R$ { this.state.session.paidOut }</Text>
                            
                        </View>

                    </View>

                    <TouchableOpacity onPress={ () => Alert.alert("Baixa todas as fotos na galeria")} style={{ position: 'absolute', flexDirection: 'row', top: -15, right: 10, width: 120, height: 30, backgroundColor: '#4563CD', alignItems: 'center', justifyContent: 'center', borderRadius: 15 }}>
                        <Icon type='FontAwesome5' name='cloud-download-alt' style={{ color: 'white', fontSize: 14 }} />
                        <Text style={{ color: 'white', marginLeft: 5 }}>Baixar fotos</Text>
                    </TouchableOpacity>

                </View>

            </View>
        );
    }
}

export default SessionDetail;