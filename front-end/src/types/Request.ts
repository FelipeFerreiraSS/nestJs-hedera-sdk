type IData<T> = {
  data: T;
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type IRequest<T = any> = {
  get: () => Promise<IData<T>>;
};