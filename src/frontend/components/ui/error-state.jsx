import { StateMessage } from './state-message';
/** Pass a safe user-facing description, never a raw exception or secret. */
export function ErrorState({
  title = 'Something went wrong.',
  ...props
}) {
  return <StateMessage {...props} title={title} error />;
}
