import { VStack, Icon, useToast, FlatList } from "native-base";
import { useCallback, useState } from "react";
import { useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native';

import { api } from "../services/api";

import { Octicons } from '@expo/vector-icons';
import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PoolCard, PollCardProps } from '../components/PoolCard';
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Pools(){
    const [isLoading, setIsLoading] = useState(true);
    const [polls, setPolls] = useState<PollCardProps[]>([]);

    const { navigate } = useNavigation();
    const toast = useToast();

    useFocusEffect(useCallback(() => {
        fetchPolls();
    }, []));

    async function fetchPolls() {
        try {
            setIsLoading(true);
            const response = await api.get('/pools');
            setPolls(response.data.polls);
            
        } catch (error) {
            console.log(error);

            toast.show({
                title: 'Não foi possível carregar os Bolões. =( ',
                placement: 'top',
                bgColor: 'red.500'
            });

        } finally {
            setIsLoading(false);
        }
    }

    return(
        <VStack flex={1} bgColor="gray.900">
            <Header 
                title="Meus Bolões"
            />
            <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor='gray.600' pb={4} mb={4}>
                <Button 
                    title="buscar bolão por código"
                    leftIcon={<Icon as={Octicons} name='search' color='black' size='md' />}
                    onPress={() => navigate('find')}
                />
            </VStack>

            {
                isLoading 
                ? 
                <Loading /> 
                : 
                <FlatList 
                    data={polls}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <PoolCard 
                            data={ item } 
                            onPress={() => navigate('details', { id: item.id })}
                        />
                    )}
                    px={5}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ pb: 20 }}
                    ListEmptyComponent={() => <EmptyPoolList />}
                />
            }

        </VStack>
    )
}