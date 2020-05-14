import shadower from "../components/shadower";
import ColorList from '../components/colorList';

export default {
    marginLeft: '0%',
    marginRight: '0%',
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    ...shadower(5),
    backgroundColor: ColorList.bodyBackground,
    color:ColorList.headerText,
    width: "100%",
    //flexWrap: 'wrap',
    height: '100%',
} 