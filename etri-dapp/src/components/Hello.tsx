// import * as React from 'react'
// import { connect } from 'react-redux'
// import * as actions from '../actions/'
// import { StoreState } from '../reducers/store-types'

// // React component
// export interface Props {
//   name: string
//   enthusiasmLevel?: number
//   asd: string,
//   onIncrement?: () => void
//   onDecrement?: () => void
// }

// function Hello({ asd, name, enthusiasmLevel = 1, onIncrement, onDecrement }: Props) {
//   if (enthusiasmLevel <= 0) {
//     throw new Error('You could be a little more enthusiastic. :D')
//   }

//   return (
//     <div className="hello">
//       <div className="greeting">Hello {name + getExclamationMarks(enthusiasmLevel)}</div>
//       <div>
//         {asd}
//         <button onClick={onDecrement}>-</button>
//         <button onClick={onIncrement}>+</button>
//       </div>
//     </div>
//   )
// }

// // Wiring up with stores and actions
// function mapStateToProps({ enthusiasmLevel, languageName }: StoreState) {
//   return {
//     enthusiasmLevel: enthusiasmLevel,
//     name: languageName,
//     asd: "hi"
//   }
// }

// function mapDispatchToProps(dispatch: any) {
//   return {
//     onIncrement: () => dispatch(actions.incrementEnthusiasm()),
//     onDecrement: () => dispatch(actions.decrementEnthusiasm())
//   }
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Hello)

// // Miscellaneous helpers
// function getExclamationMarks(numChars: number) {
//   return Array(numChars + 1).join('!')
// }
