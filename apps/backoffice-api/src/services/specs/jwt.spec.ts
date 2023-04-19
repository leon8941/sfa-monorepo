import { generateAccessToken } from '../jwt';
import { TokenInput } from '../../types';

test('test jwt', async () => {
    const input: TokenInput = {
        id: 'id-1',
        sessionId: 'session-id-2',
    };

    const token = await generateAccessToken(input);

    expect(token).toBeTruthy();
})