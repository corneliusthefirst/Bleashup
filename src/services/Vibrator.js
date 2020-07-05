
import { Vibration } from 'react-native';
class VibratorClass {
    shortDuration = 10
    vibrateShort(){
        Vibration.vibrate(this.shortDuration)
    }
    longDuration = [20,0,0,30]
    vibrateLong(){
        Vibration.vibrate(this.longDuration)
    }
}
const Vibrator = new VibratorClass()
export default Vibrator