// Applies fn to each value in list, splitting it into a new list each time fn
// returns a different value.
import { List } from 'immutable/dist/immutable';

export default (fn, list) =>
  list.isEmpty()
    ? List()
    : list
        .rest()
        .reduce(
          (reduction, current) =>
            fn(reduction.last().last(), current)
              ? reduction.push(List([current]))
              : reduction.update(reduction.size - 1, list =>
                  list.push(current),
                ),
          List([List([list.first()])]),
        );
