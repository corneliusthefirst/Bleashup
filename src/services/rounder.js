import shadower from "../components/shadower";
import ColorList from '../components/colorList';

export default function rounder(size, bac) {
    return {
        width: size,
        height: size,
        borderRadius: size - 5,
        flexDirection: 'column',
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: bac ? typeof bac === "string" ? bac : "rgba(34, 0, 0, 0.1)" : ColorList.bodyBackground,
        justifyContent: 'center',
        ...shadower(1),
    }
}