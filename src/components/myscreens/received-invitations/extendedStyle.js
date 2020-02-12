
import { StyleSheet } from 'react-native';
const Exstyles = StyleSheet.create({
	
	descModal:{
	 padding:20,
	 alignItems: 'center',
	 height: 220,
	 flex:1,
	 borderRadius:15,
	 backgroundColor:'#FEFFDE',
	 width:330},

  column: {
    width: '80%'                                    // 80% of screen width
  },
  text: {
    color: '$textColor',                            // global variable $textColor
    fontSize: '1.5rem'                              // relative REM unit
  },
  '@media (min-width: 350) and (max-width: 500)': { // media queries
    text: {
      fontSize: '2rem',
    }
  }
});

export default Exstyles ;