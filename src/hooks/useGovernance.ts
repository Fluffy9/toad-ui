import { useWriteContract, useReadContract } from 'wagmi';
import ERC20Votes_ABI from '../../public/abi/ERC20Votes.json';
import TOAD_ABI from '../../public/abi/TOAD.json';
import { contracts } from '@/config/constants';
import { Hash } from 'viem';

export function useGovernance() {
    const { writeContract } = useWriteContract();
    const { data: currentDelegate } = useReadContract({
        address: contracts.governance,
        abi: ERC20Votes_ABI.abi,
        functionName: 'delegates',
        args: [contracts.governance],
    });

    const delegateVotes = async (delegateAddress: string): Promise<Hash> => {
        try {
            const hash = await writeContract({
                address: contracts.governance,
                abi: ERC20Votes_ABI.abi,
                functionName: 'delegate',
                args: [delegateAddress],
            });
            if (!hash) throw new Error('Failed to get transaction hash');
            return hash;
        } catch (error) {
            console.error('Error delegating votes:', error);
            throw error;
        }
    };

    const setDisablePower = async (tallyIds: number[]): Promise<Hash> => {
        try {
            const hash = await writeContract({
                address: contracts.toad,
                abi: TOAD_ABI.abi,
                functionName: 'setDisablePower',
                args: [tallyIds],
            });
            if (!hash) throw new Error('Failed to get transaction hash');
            return hash;
        } catch (error) {
            console.error('Error setting disable power:', error);
            throw error;
        }
    };

    const toggleDisablePower = async (tallyIds: number[], member: string): Promise<Hash> => {
        try {
            const hash = await writeContract({
                address: contracts.toad,
                abi: TOAD_ABI.abi,
                functionName: 'toggle',
                args: [tallyIds, member],
            });
            if (!hash) throw new Error('Failed to get transaction hash');
            return hash;
        } catch (error) {
            console.error('Error toggling disable power:', error);
            throw error;
        }
    };

    return {
        currentDelegate,
        delegateVotes,
        setDisablePower,
        toggleDisablePower,
    };
} 