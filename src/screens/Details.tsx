import { useEffect, useState } from "react";
import { Share } from "react-native";
import { HStack, useToast, VStack } from "native-base";
import { useRoute } from '@react-navigation/native'

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PollCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

import { api } from "../services/api";

interface RouteParams {
    id: string;
}

export function Details(){
    const [isLoading, setIsLoading] = useState(true);
    const [pollDetails, setPollDetails] = useState<PollCardProps>({} as PollCardProps);
    const [optionSelected, setOptionSelected] = useState<'PALPITTES' | 'RANKING'>('PALPITTES');

    const route = useRoute();
    const toast = useToast();

    const { id } = route.params as RouteParams;

    async function fetchPollDetails(){
        try {
            setIsLoading(true);

            const response = await api.get(`/pools/${id}`);

            setPollDetails(response.data.poll);

        } catch (error) {
            console.log(error);

            toast.show({
                title: 'Não foi possível carregar o Bolão. =( ',
                placement: 'top',
                bgColor: 'red.500'
            });

        } finally {
            setIsLoading(false);
        }
    }

    async function handleCodeShare(){
        await Share.share({
            message: pollDetails.code
        })
    }

    useEffect(() => {
        fetchPollDetails();
    }, [id]);

    if(isLoading){
        return <Loading />
    }

    return(
        <VStack flex={1} bgColor="gray.900">
            <Header 
                title={pollDetails.title} 
                showBackButton 
                showShareButton 
                onShare={handleCodeShare}
            />

            {
                pollDetails._count?.participants > 0 
                ?
                <VStack px={5} flex={1}>
                    <PoolHeader data={pollDetails} />

                    <HStack bgColor='gray.800' p={1} rounded='sm' mb={5}>
                        <Option 
                            title="Seus Palpites" 
                            isSelected={optionSelected === 'PALPITTES'}
                            onPress={() => setOptionSelected('PALPITTES')}
                        />
                        <Option 
                            title="Ranking do grupo" 
                            isSelected={optionSelected === 'RANKING'}
                            onPress={() => setOptionSelected('RANKING')}

                        />
                    </HStack>

                    <Guesses poolId={pollDetails.id} />

                </VStack>
                :
                <EmptyMyPoolList code={pollDetails.code} />
            }

        </VStack>
    )
}