import { useWriteContract, useReadContract } from 'wagmi';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '@/config/wagmi';
import ERC20Votes_ABI from '../../public/abi/ERC20Votes.json';
import TOAD_ABI from '../../public/abi/TOAD.json';
import { contracts } from '@/config/constants';
import { Hash } from 'viem';
import { toast } from 'react-hot-toast';

export function useGovernance() {
    const { writeContractAsync } = useWriteContract();
    const { data: currentDelegate } = useReadContract({
        address: contracts.governance,
        abi: ERC20Votes_ABI.abi,
        functionName: 'delegates',
        args: [contracts.governance],
    });

    const delegateVotes = async (delegateAddress: string): Promise<Hash> => {
        try {
            const hash = await writeContractAsync({
                address: contracts.governance,
                abi: ERC20Votes_ABI.abi,
                functionName: 'delegate',
                args: [delegateAddress],
            });

            const receipt = await waitForTransactionReceipt(config, {
                hash,
            });

            if (receipt?.status === 'success') {
                toast.success('Votes delegated successfully');
            } else {
                toast.error('Transaction failed or was reverted');
            }

            return hash;
        } catch (error) {
            console.error('Error delegating votes:', error);
            toast.error('Failed to delegate votes. Please try again.');
            throw error;
        }
    };

    const setDisablePower = async (tallyIds: number[]): Promise<Hash> => {
        try {
            const hash = await writeContractAsync({
                address: contracts.toad,
                abi: TOAD_ABI.abi,
                functionName: 'setDisablePower',
                args: [tallyIds],
            });

            const receipt = await waitForTransactionReceipt(config, {
                hash,
            });

            if (receipt?.status === 'success') {
                toast.success('Disable power set successfully');
            } else {
                toast.error('Transaction failed or was reverted');
            }

            return hash;
        } catch (error) {
            console.error('Error setting disable power:', error);
            toast.error('Failed to set disable power. Please try again.');
            throw error;
        }
    };

    const toggleDisablePower = async (tallyIds: number[], member: string): Promise<Hash> => {
        try {
            const hash = await writeContractAsync({
                address: contracts.toad,
                abi: TOAD_ABI.abi,
                functionName: 'toggle',
                args: [tallyIds, member],
            });

            const receipt = await waitForTransactionReceipt(config, {
                hash,
            });

            if (receipt?.status === 'success') {
                toast.success('Disable power toggled successfully');
            } else {
                toast.error('Transaction failed or was reverted');
            }

            return hash;
        } catch (error) {
            console.error('Error toggling disable power:', error);
            toast.error('Failed to toggle disable power. Please try again.');
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