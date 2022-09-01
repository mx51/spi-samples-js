import calculator from './calculator';

describe('Calculator', () => {
  test('adding number', () => {
    expect(calculator('1', '5')).toEqual('15');
    expect(calculator('0', '5')).toEqual('5');
    expect(calculator('145', '5')).toEqual('1455');
    expect(calculator('1111', '5')).toEqual('11115');
    expect(calculator('11115', '6')).toEqual('111156');
    expect(calculator('222251', '3')).toEqual('222251');
  });
  test('adding decimal number', () => {
    expect(calculator('0.5', '6')).toEqual('0.56');
    expect(calculator('0.', '8')).toEqual('0.8');
    expect(calculator('0.81', '6')).toEqual('0.81');
  });
  test('removing number', () => {
    expect(calculator('15', 'Backspace')).toEqual('1');
    expect(calculator('6', 'Backspace')).toEqual('0');
    expect(calculator('0', 'Backspace')).toEqual('0');
    expect(calculator('97.78', 'Backspace')).toEqual('97.7');
  });
  test('adding decimal point', () => {
    expect(calculator('15', '.')).toEqual('15.');
    expect(calculator('0', '.')).toEqual('0.');
    expect(calculator('13.4', '.')).toEqual('13.4');
  });
});
