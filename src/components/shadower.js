export default shadower = (elevation) => {
    return {
        shadowOpacity: 1,
        shadowOffset: {
            height: 1,
        },
        shadowRadius: 10, elevation: elevation ? elevation : 6
    }
}