import labler from '../components/myscreens/eventChat/labler';
 export default function formVoteOptions(vote){
    let options = vote.option.map((ele, index) => `\t ${labler(index)}. ${ele.name} \n\n`)
    return options.join('')
}